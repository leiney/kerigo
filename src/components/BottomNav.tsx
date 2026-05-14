import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';

export const BottomNav: React.FC<{ cartCount?: number }> = ({ cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem =
    location.pathname === '/' ? 'home' :
    location.pathname.startsWith('/orders') ? 'orders' :
    location.pathname.startsWith('/cart') ? 'cart' :
    location.pathname.startsWith('/account') ? 'account' :
    '';

  const itemClasses = (isActive: boolean) =>
    `flex flex-col items-center gap-1 cursor-pointer transition-colors ${
      isActive ? 'text-primary' : 'text-foreground/40 hover:text-foreground/70'
    }`;

  return (
    <div className="fixed bottom-4 left-4 right-4 h-16 bg-white rounded-[2rem] border border-border shadow-lg flex justify-around items-center z-50">
      <div onClick={() => navigate('/')} className={itemClasses(activeItem === 'home')}>
        <Home className={`h-6 w-6 ${activeItem === 'home' ? 'text-primary' : 'text-current'}`} />
        <span className="text-[10px] font-bold">Home</span>
      </div>

      <div onClick={() => navigate('/orders')} className={itemClasses(activeItem === 'orders')}>
        <ShoppingBag className={`h-6 w-6 ${activeItem === 'orders' ? 'text-primary' : 'text-current'}`} />
        <span className="text-[10px] font-bold">Orders</span>
      </div>

      <div onClick={() => navigate('/cart')} className={`${itemClasses(activeItem === 'cart')} relative`}>
        <ShoppingCart className={`h-6 w-6 ${activeItem === 'cart' ? 'text-primary' : 'text-current'}`} />
        {typeof cartCount === 'number' && cartCount > 0 && (
          <span className={`absolute -top-1 -right-6 rounded-full text-[10px] font-bold px-2 ${activeItem === 'cart' ? 'bg-primary text-white' : 'bg-foreground/10 text-foreground/60'}`}>
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-bold">Cart</span>
      </div>

      <div onClick={() => navigate('/account')} className={itemClasses(activeItem === 'account')}>
        <User className={`h-6 w-6 ${activeItem === 'account' ? 'text-primary' : 'text-current'}`} />
        <span className="text-[10px] font-bold">Account</span>
      </div>
    </div>
  );
};

export default BottomNav;
