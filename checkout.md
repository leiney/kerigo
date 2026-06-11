'use client'
import { useState, useEffect } from 'react'
import { PhoneIcon, BuildingStorefrontIcon, TruckIcon,ChevronRightIcon, PencilSquareIcon } from '@heroicons/react/24/solid'
import { useCart } from '../contexts/cartWishlistContext'
import { useAuth } from '../contexts/AuthContext'
import { getAddresses } from '../services/address/addressService'
import { createOrder } from '../services/order/orderService';
import Toast from '../components/Products/toast-notification'
import ReturnHeaders, { BASE_URL, QUERY_STRING } from '../Config/config'
import MpesaPaymentModal from '../components/Payments/MpesaPaymentModal'
import axios from 'axios'
import { CartItem } from '../types/moreProductTypes'
import Select from 'react-select'
import AddressModal from '../components/Address/AddressModal'
import { formatCurrency } from '../utils/reusablefunctions'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Spinner from '../components/utils/Spinner'
import { useNavigate } from 'react-router-dom'

type PaymentMethod = 'card' | 'mpesa' | 'pay_on_delivery' | 'pay_at_store'
type DeliveryMethod = 'store' | 'courier'

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  additionalPhone: string;
  streetAddress: string;
  city: string;
  county: string;
  landmark: string;
  isDefault: boolean;
}


interface TaxCodeProp{
  code: string,
  contry: string,
  percent: number,
  taxID: string,
  description: string,
}

interface Zone {
  zoneID: string;
  zoneName: string;
  shippingCost: number;
  deliveryDurationLength: number;
  deliveryDurationType: string;
  deliveryThreshholdAmount: number;
  description?: string;
}

interface ZoneOption {
  value: string;
  label: string;
}
interface Store {
  storeID?: string;
  storeName: string;
  location: string;
}

const calculateItemTaxes = (item: CartItem, taxCodes: TaxCodeProp[]) => {
  const variant = item.product.variants[0];
  const itemPrice = variant.price * item.quantity;
  const itemTaxCodes = item.product.taxCodes || [];
  const applicableTaxes = taxCodes.filter((tax: TaxCodeProp) => itemTaxCodes && itemTaxCodes.includes(tax.code));
  
  const taxes = applicableTaxes.map(tax => ({
    code: tax.code,
    description: tax?.description,
    percent: tax.percent,
    amount: itemPrice * (tax.percent / 100)
  }));

  return {
    taxes: taxes.map(tax => ({
      ...tax,
      amount: tax.amount.toFixed(2) 
    })),
    totalTax: taxes.reduce((sum, tax) => sum + tax.amount, 0).toFixed(2) 
  };
};

export default function CheckoutPage() {
  const { user, token, isAuthenticated } = useAuth()
  const { cart, clearCart } = useCart()  // Add clearCart here
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_on_delivery')
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')
  const [showMpesaModal, setShowMpesaModal] = useState(false)
  const [paymentSubmiting, setPaymentSubmiting] = useState(false)
  const [taxCodes , setTaxCodes] = useState<TaxCodeProp[] | []>([])
  const [shippingZones, setShippingZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);  // Add this state
  const navigate = useNavigate()

  

  const fetchStores = async () => {
    setIsLoadingStores(true);
    const headers = ReturnHeaders(token);
    try {
      const response = await axios.get(`${BASE_URL}/product-stores`, { headers });
      setStores(response.data);
      // Set first store as default if available
      if (response.data.length > 0) {
        setSelectedCollectionPoint(response.data[0]);
      }
    } catch (error) {       
      console.error('Error fetching product stores:', error);
    } finally {
      setIsLoadingStores(false);
    }
  }


  useEffect(() => {
    if (token) {
      fetchStores()      
    }
  }, [token])
  

 
 

  const [selectedCollectionPoint, setSelectedCollectionPoint] = useState(stores[0]);

  const fetchTax = async()=>{
    const headers = ReturnHeaders(token)
    const response = await axios.get(`${BASE_URL}/tax-codes`, { headers })  
    setTaxCodes(response.data)
}

const fetchShippingZones = async () => {
  try {
    const headers = ReturnHeaders(token)
    const response = await axios.get(`${BASE_URL}/shipping-zones`, { headers })
    setShippingZones(response.data)
  } catch (error) {
    console.error('Error fetching shipping zones:', error)
  }
}

useEffect(()=>{
  if(token){
    fetchTax()
    fetchShippingZones()
  }
}, [token])

  const [extraData , setExtraData] = useState({
    paymentInfo:{
      phoneNo: "",
      receiptNo: "",
      accountRefference: ""
    }
  })


  useEffect(() => {
    if (!isAuthenticated ) {
      navigate(`/account?redirect=${encodeURIComponent('/checkout')}`)
      return
    }

    if (cart.length === 0){
      navigate('/cart')
      return
    }

  

    const fetchDefaultAddress = async () => {
      if (!user?.id || !token) return
      
      try {
        const addresses = await getAddresses(user.id, token)
        // first try to find default address, if not found use the last address in the list
        const defaultAddr = addresses.find((addr: Address) => addr.isDefault) || addresses[addresses.length - 1]
        setDefaultAddress(defaultAddr || null)
      } catch (error) {
        console.error('Error fetching address:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDefaultAddress()
  }, [user?.id, token, isAuthenticated, navigate])

  const handleAddressCreated = async () => {
    if (!user?.id || !token) return;
    try {
      const addresses = await getAddresses(user.id, token);
      // first try to find default address, if not found use the last address in the list
      const defaultAddr = addresses.find((addr: Address) => addr.isDefault) || addresses[addresses.length - 1]
      setDefaultAddress(defaultAddr || null);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Calculate cart items with taxes
  const cartWithTaxes = cart.map(item => {
    const taxInfo = calculateItemTaxes(item, taxCodes);
    return {
      ...item,
      taxInfo
    };
  });

  const subtotal = cart.reduce((sum, item) => {
    const variant = item.product.variants[0];
    return sum + (variant.price * item.quantity);
  }, 0);

  const totalTax = cartWithTaxes.reduce((sum, item) => sum + parseFloat(item.taxInfo.totalTax), 0);


  // 3. Update getDeliveryMethods to include selected collection point
  const getDeliveryMethods = () => ({
    store: {
      id: 'store',
      name: 'Collect at Store',
      description: selectedCollectionPoint 
        ? `Pick up from ${selectedCollectionPoint?.storeName}, ${selectedCollectionPoint?.location}`
        : 'Choose a collection point',
      price: 0,
      icon: <BuildingStorefrontIcon className="w-5 h-5 text-white" />
    },
    courier: {
      id: 'courier',
      name: 'Delivery by Courier',
      description: selectedZone 
        ? `${selectedZone.zoneName} - Delivery in ${selectedZone.deliveryDurationLength} ${selectedZone.deliveryDurationType}`
        : 'Select your delivery zone',
      price: calculateDeliveryPrice(),
      icon: <TruckIcon className="w-5 h-5 text-white" />
    }
  })

  const calculateDeliveryPrice = () => {
    if (!selectedZone) return 0
    if (subtotal >= selectedZone.deliveryThreshholdAmount) return 0
    return selectedZone.shippingCost
  }

  const deliveryFee = calculateDeliveryPrice()
  const total = subtotal + deliveryFee 

  // update the delivery method change handler
  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method)
    // set payment method based on delivery type
    setPaymentMethod(method === 'store' ? 'pay_at_store' : 'pay_on_delivery')
  }


  /* const productTaxCodes = cart.map(item => {    
    return  item.product.taxCodes || []; 
  }); */

  //const flattenedProductTaxCodes = productTaxCodes.flat();
  //const avalaibleTaxes = taxCodes.filter(tax => flattenedProductTaxCodes.length > 0 && flattenedProductTaxCodes.includes(tax.code));


  const showToastNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  // Update createNewOrder to include tax information
  const createNewOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderItems = cartWithTaxes.map(item => ({
        productID: item.product.productID?.toString() || "",
        variantID: item.product.variants[0].variantID.toString(),
        quantity: item.quantity,
        taxes: item.taxInfo.taxes,
        itemTax: item.taxInfo.totalTax
      }));

      const orderData = {
        customer: user?.id || "",
        orderDate: new Date().toISOString(),
        total,
        subTotal: subtotal,
        totalTax,
        orderItems,
        paymentStatus: 'pending' as 'pending' | 'paid' | 'canceled' | 'returned',
        orderStatus: 'new' as 'new' | 'processing' | 'readyForShipping' | 'shipped' | 'delivered' | 'cancelled' | 'returned',
        deliveryMethod,
        paymentMethod,
        shippingZone: selectedZone ? {
          zoneID: selectedZone.zoneID,
          zoneName: selectedZone.zoneName,
          shippingCost: deliveryFee,
          originalCost: selectedZone.shippingCost,
          freeShippingApplied: subtotal >= (selectedZone?.deliveryThreshholdAmount || 0)
        } : null,
        ...(deliveryMethod === 'courier' && defaultAddress && {
          shippingAddress: {
            fullName: defaultAddress.fullName,
            phoneNumber: defaultAddress.phoneNumber,
            streetAddress: defaultAddress.streetAddress,
            city: defaultAddress.city,
            county: defaultAddress.county,
            landmark: defaultAddress.landmark,
          }
        }),
        ...(deliveryMethod === 'store' && selectedCollectionPoint && {
          store: {
            storeID: selectedCollectionPoint.storeID?.toString() || "",
            storeName: selectedCollectionPoint.storeName,
            location: selectedCollectionPoint.location,
          }
        }),
        extraData
      };

      const order = await createOrder(orderData, token);
      
      showToastNotification('Order placed successfully!', 'success');
      clearCart();
      navigate(`/customer/orders/${order.orderID}`);
    } catch (error) {
      console.error('Error placing order:', error);
      showToastNotification('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSTKPushInitiation = async (paymentData: {
    phoneNumber: string
    accountReference?: string})=>{
      const data = JSON.stringify({
          amount: total,
          phoneNo: paymentData.phoneNumber,
          accountRef: paymentData.accountReference
        })
    setPaymentSubmiting(true)  
    try{
      const headers = ReturnHeaders(token)  
      await axios.post(`${BASE_URL}/mpesa/stk-push`, data, { headers })      
    }catch(error){
            console.error('M-PESA payment error:', error)
        showToastNotification('Payment failed. Please try again.', 'error')
    } finally {
        setPaymentSubmiting(false)
    }      

  }

  const handleMpesaPayment = async (paymentData: {
    paymentType: 'paybill' | 'stk'
    phoneNumber: string
    accountReference?: string
    mpesaReceiptNo?: string
  }) => {
    setPaymentSubmiting(true)
    const paymentInfo = {
      phoneNo: paymentData.phoneNumber,
      receiptNo: paymentData.mpesaReceiptNo || " ",
      accountRefference: paymentData.accountReference || " "
    }
    setExtraData({ paymentInfo })
    try {      
      await createNewOrder();   

    } catch (error) {
      console.error('M-PESA payment error:', error)
      showToastNotification('Payment failed. Please try again.', 'error')
    } finally {
      setPaymentSubmiting(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!user?.id || !token) return;

    if (deliveryMethod === 'courier' && !selectedZone) {
      showToastNotification('Please select a delivery zone', 'error');
      return;
    }

    if (deliveryMethod === 'store' && !selectedCollectionPoint) {
      showToastNotification('Please select a collection point', 'error');
      return;
    }

    if (paymentMethod === 'mpesa') {
      setShowMpesaModal(true)
      return
    }
    // for non-MPESA payments, create order directly
    await createNewOrder();
  };

  return (
    <div className="min-h-screen bg-primary ">
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />



      {/* Breadcrumb */}
      <div className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-primary-text">
            <span onClick={()=>navigate("/")} className="hover:text-accent flex-shrink-0 cursor-pointer">
              Home
            </span>
            <ChevronRightIcon className="w-4 h-4" />
            <>
              <span 
                onClick={()=>navigate("/cart")}
                className="hover:text-accent flex-shrink-0 cursor-pointer"
              >
                Cart
              </span>
              <ChevronRightIcon  className="flex-shrink-0 h-4 w-4" />
        
            <>
              <span                 
                className="hover:text-accent flex-shrink-0 cursor-pointer text-accent"
              >
                Checkout
              </span>
            </>
            </>        
            
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 pb-16 pt-2">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-8">
            {/* Delivery Details */}
            <div className="bg-primary p-6 rounded-[4px] border border-light-border ">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-primary-text">Delivery Details</h2>               
              </div>

              {/* Delivery Method Selection */}
              <div className="space-y-4 mb-6">
                {Object.values(getDeliveryMethods()).map((method) => {
                  const Icon = method.icon
                  return (
                    <label
                      key={method.id}
                      className={`
                        flex items-center justify-between p-4 rounded-[4px] border cursor-pointer
                        ${deliveryMethod === method.id 
                            ?'border-accent  bg-secondary' 
                            :'border-light-border hover:bg-secondary'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          value={method.id}
                          checked={deliveryMethod === method.id}
                          onChange={(e) => handleDeliveryMethodChange(e.target.value as DeliveryMethod)}
                          className="text-accent focus:ring-pink-600"
                        />
                        <div className="flex items-center gap-3">
                           {Icon} 
                          <div>
                            <p className="font-medium text-primary-text">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-primary-text">
                        {method.price === 0 ? 'FREE' : formatCurrency(Number(method.price))}
                      </span>
                    </label>
                  )
                })}
              </div>

              {/* Courier Delivery Requirements Notice */}
              {deliveryMethod === 'courier' && (
                <div className="mb-6 p-3 bg-pink-50 border border-pink-200 rounded-[4px] text-sm">
                  <p className="text-primary-text font-medium">Courier Delivery Requirements:</p>
                  <ul className="list-disc list-inside mt-1 text-gray-600">
                    <li>Select your delivery zone</li>
                    <li>Provide a delivery address</li>
                  </ul>
                </div>
              )}

              {/* Delivery Zone Selector */}
              {deliveryMethod === 'courier' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Select Delivery Zone <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedZone ? {
                      value: selectedZone.zoneID,
                      label: `${selectedZone.zoneName} - ${formatCurrency(Number(selectedZone.shippingCost))}${
                        selectedZone.deliveryThreshholdAmount > 0 
                          ? ` (Free above ${formatCurrency(Number(selectedZone.deliveryThreshholdAmount))})`
                          : ''
                      }`
                    } : null}
                    onChange={(option: ZoneOption | null) => {
                      const zone = shippingZones.find(z => z.zoneID === option?.value)
                      setSelectedZone(zone || null)
                    }}
                    options={shippingZones.map(zone => ({
                      value: zone.zoneID,
                      label: `${zone.zoneName} - ${formatCurrency(Number(zone.shippingCost))}${
                        zone.deliveryThreshholdAmount > 0 
                          ? ` (Free above ${formatCurrency(Number(zone.deliveryThreshholdAmount))})`
                          : ''
                      }`
                    }))}
                    placeholder="Select a delivery zone"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: 'var(--accent-color-1)',
                        primary25: 'var(--accent-color-1)',
                      },
                    })}
                  />
                  {!selectedZone && deliveryMethod === 'courier' && (
                    <p className="mt-1 text-sm text-red-500">Please select your delivery zone first</p>
                  )}
                  {selectedZone && subtotal >= selectedZone.deliveryThreshholdAmount && (
                    <p className="mt-2 text-sm text-green-600">
                      Free delivery applied! (Orders above {formatCurrency(Number(selectedZone.deliveryThreshholdAmount))})
                    </p>
                  )}
                </div>
              )}

              {/* Delivery Address Section - Only show when zone is selected */}
              {deliveryMethod === 'courier' && selectedZone && (
                <div className="mt-6 pt-6 border-t border-light-border">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-primary-text">
                          Delivery Address <span className="text-red-500">*</span>
                        </h3>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="text-sm text-accent hover:text-pink-700 flex items-center gap-2"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          {defaultAddress ? 'Change Address' : 'Add Address'}
                        </button>
                      </div>
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Spinner size='medium' accent/>
                          <span>Loading address...</span>
                        </div>
                      ) : defaultAddress ? (
                        <>
                          <p className="text-sm text-primary-text">{defaultAddress.fullName}</p>
                          <p className="text-sm text-gray-500">{defaultAddress.phoneNumber}</p>
                          <p className="text-sm text-gray-500">{defaultAddress.streetAddress}</p>
                          <p className="text-sm text-gray-500">{defaultAddress.landmark}</p>
                          <p className="text-sm text-gray-500">{defaultAddress.city}, {defaultAddress.county}</p>
                        </>
                      ) : (
                        <div className="text-sm">
                          <p className="text-red-500">No delivery address set.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Store Address - Show only for store collection */}
              {deliveryMethod === 'store' && (
                <div className="mt-6 pt-6 border-t border-light-border">
                  <div className="mb-4">
                    <h3 className="font-medium text-primary-text mb-2">Choose Collection Point <span className="text-red-500">*</span></h3>
                    {isLoadingStores ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500 p-4">
                         <Spinner size='medium' accent/>
                        <span>Loading stores...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {stores.map(store => (
                          <label
                            key={store?.storeID}
                            className={`
                              flex items-center gap-3 p-3 rounded-[4px] border cursor-pointer
                              ${selectedCollectionPoint?.storeID === store?.storeID 
                                ? 'border-accent bg-secondary'
                                : 'border-light-border hover:bg-secondary'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="collectionPoint"
                              value={store?.storeID}
                              checked={selectedCollectionPoint?.storeID === store?.storeID}
                              onChange={() => setSelectedCollectionPoint(store)}
                              className="text-accent focus:ring-pink-600"
                            />
                            <div>
                              <span className="font-medium text-primary-text">{store.storeName}</span>
                              <p className="text-sm text-gray-500">{store.location}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <BuildingStorefrontIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-text mb-1">Collection Point Details</h3>
                      <p className="text-sm text-primary-text">{selectedCollectionPoint?.storeName}</p>
                      <p className="text-sm text-gray-500">{selectedCollectionPoint?.location}</p>
                      
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-primary p-6 rounded-[4px] border border-light-border">
              <h2 className="text-lg font-bold text-primary-text mb-4">Payment Method</h2>
              <div className="space-y-4">
                {/* Pay at Store - Show first when store collection is selected */}
                {deliveryMethod === 'store' && (
                  <label
                    className={`
                      flex items-center gap-4 p-4 rounded-[4px] border cursor-pointer
                      ${paymentMethod === 'pay_at_store' 
                        ? 'border-accent  bg-secondary' 
                        : 'border-light-border hover:bg-secondary'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="pay_at_store"
                      checked={paymentMethod === 'pay_at_store'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="text-accent focus:ring-pink-600"
                    />
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="w-5 h-5 text-primary-text" />
                      <div>
                        <span className="font-medium text-primary-text">Pay at Store</span>
                        <p className="text-sm text-gray-500">Pay when you collect your order</p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Pay on Delivery - Show first when courier delivery is selected */}
                {deliveryMethod === 'courier' && (
                  <label
                    className={`
                      flex items-center gap-4 p-4 rounded-[4px] border cursor-pointer
                      ${paymentMethod === 'pay_on_delivery' 
                        ? 'border-accent  bg-secondary' 
                        : 'border-light-border hover:bg-secondary'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="pay_on_delivery"
                      checked={paymentMethod === 'pay_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="text-accent focus:ring-pink-600"
                    />
                    <div className="flex items-center gap-3">
                      <TruckIcon className="w-5 h-5 text-primary-text" />
                      <div>
                        <span className="font-medium text-primary-text">Pay on Delivery</span>
                        <p className="text-sm text-gray-500">Cash or card payment to courier</p>
                      </div>
                    </div>
                  </label>
                )}

                {/* M-PESA */}
                <label
                  className={`
                    flex items-center gap-4 p-4 rounded-[4px] border cursor-pointer
                    ${paymentMethod === 'mpesa' 
                      ? 'border-accent  bg-secondary' 
                      : 'border-light-border hover:bg-secondary'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-accent focus:ring-pink-600"
                  />
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-primary-text">M-PESA</span>
                  </div>
                </label>

                {/* Card Payment */}
                {/* <label
                  className={`
                    flex items-center gap-4 p-4 rounded-[4px] border cursor-pointer
                    ${paymentMethod === 'card' 
                      ? 'border-accent  bg-secondary' 
                      : 'border-light-border hover:bg-secondary'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-accent focus:ring-pink-600"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary-text" />
                    <span className="font-medium text-primary-text">Credit/Debit Card</span>
                  </div>
                </label> */}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-secondary p-6 rounded-[4px] border border-light-border h-fit">
            <h2 className="text-lg font-bold text-primary-text mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartWithTaxes.map((item) => {
                const variant = item.product.variants[0];
                const variantImage = variant.images.find(img => img.isPrimary) || variant.images[0];
                const itemTotal = variant.price * item.quantity;
                
                return (
                  <div key={`${item.product.productID}-${variant.variantID}`} className="flex flex-col">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center p-1">
                        <img
                          src={`${variantImage.imageURL}${QUERY_STRING}`}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain rounded-[4px]"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md primary font-medium text-primary-text">
                          {item.product.name}
                          {variant.attributes && variant.attributes.length > 0 && (
                            <span className="text-sm text-accent ml-2">
                              ({variant.attributes.map(attr => attr.value).join(' - ')})
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex justify-between">
                            <span className='text-primary-text'>Unit Price:</span>
                            <span className='text-primary-text'>{formatCurrency(Number(variant.price))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className='text-primary-text'>Quantity:</span>
                            <span className='text-primary-text'>{item.quantity}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className='text-primary-text '>Subtotal:</span>
                            <span className='text-accent'>{formatCurrency(Number(itemTotal))}</span>
                          </div>
                        </div>
                      </div>
                    </div>                   
                    <div className="mt-4 border-b border-light-border"></div>
                  </div>
                );
              })}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-primary-text">Subtotal</span>
                <span className="text-primary-text">{formatCurrency(Number(subtotal))}</span>
              </div>

              {/* <div className="flex justify-between text-sm">
                <span className="text-primary-text">Total Tax Paid</span>
                <span className="text-primary-text">KES {totalTax.toLocaleString()}</span>
              </div> */}

              <div className="flex justify-between text-sm">
                <span className="text-primary-text">Delivery Fee</span>
                <span className="text-primary-text">{formatCurrency(Number(deliveryFee))}</span>
              </div>

              <div className="flex justify-between font-medium pt-2 border-t border-light-border">
                <span className="text-primary-text font-bold text-lg">Total</span>
                <span className="text-accent font-bold ">{formatCurrency(Number(total))}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={
                (deliveryMethod === 'courier' && (!defaultAddress || !selectedZone)) || 
                (deliveryMethod === 'store' && !selectedCollectionPoint) ||
                isSubmitting
              }
              className="w-full mt-6 px-6 py-3 bg-accent text-white font-medium rounded-[4px] 
                        hover:bg-pink-600/90 transition-colors flex items-center justify-center gap-2 
                        disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isSubmitting ? 'Processing...' : 'Place Order'}
              {!isSubmitting && <ChevronRightIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <MpesaPaymentModal
        isOpen={showMpesaModal}
        onClose={() => setShowMpesaModal(false)}
        amount={total}
        onSubmit={handleMpesaPayment}
        paymentSubmiting = {paymentSubmiting}
        initiateSTKPush={handleSTKPushInitiation}
      />
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressCreated={handleAddressCreated}
        editAddress={defaultAddress || undefined}
      />
    </div>
  )
}