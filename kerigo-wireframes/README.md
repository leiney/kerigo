## Installation

### NPM

```bash
npm install --save @stackloop/ui
```

### Peer Dependencies

Ensure `react` and `react-dom` (>=18) are installed.

### Next.js Setup

#### 1. Import Theme CSS

Import the library CSS in your root layout or `_app.tsx`:

```tsx
// app/layout.tsx (App Router)
import '@stackloop/ui/theme.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// pages/_app.tsx (Pages Router)
import '@stackloop/ui/theme.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### 2. Tailwind Configuration

If using Tailwind CSS v4 with `@theme`, the library's theme variables are already configured. If you need to customize colors:

```css
/* In your global CSS or theme.css */
@theme {
  /* Override library colors */
  --color-primary: #your-color;
  --color-border: #your-border-color;
  --color-border-dark: #your-darker-border;
  --color-secondary: #your-secondary-bg;
  --color-background: #your-bg-color;
  --color-foreground: #your-text-color;
  
  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Usage with React (Vite/CRA)

```js
// In your main entry file (main.tsx or index.tsx)
import '@stackloop/ui/theme.css'
```

## Importing Components

Import components from the package root:

```tsx
import { Button, ButtonGroup, Modal, Input } from '@stackloop/ui'
```

All components are **client-side** components with `'use client'` directive, making them compatible with Next.js App Router.

## Theme Customization

The library uses a simplified color system with semantic variables:

### Color Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-primary` | `#525252` | Primary brand color |
| `--color-border` | `#e5e5e5` | Default border color |
| `--color-border-dark` | `#d4d4d4` | Darker border variant |
| `--color-secondary` | `#fafafa` | Secondary background |
| `--color-background` | `#ffffff` | Main background |
| `--color-foreground` | `#171717` | Primary text color |
| `--color-success` | `#10b981` | Success state |
| `--color-warning` | `#f59e0b` | Warning state |
| `--color-error` | `#ef4444` | Error state |
| `--color-info` | `#3b82f6` | Info state |

### Customizing Colors

Create a custom theme file or extend the existing one:

```css
/* styles/custom-theme.css */
@import '@stackloop/ui/theme.css';

@theme {
  /* Brand colors */
  --color-primary: #3b82f6;
  
  /* Borders */
  --color-border: #e2e8f0;
  --color-border-dark: #cbd5e1;
  
  /* Backgrounds */
  --color-secondary: #f8fafc;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}
```

### Dark Mode Support

You can add dark mode variants:

```css
@theme {
  /* Light mode (default) */
  --color-background: #ffffff;
  --color-foreground: #171717;
  
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
    --color-primary: #60a5fa;
    --color-border: #27272a;
  }
}
```

## Components Reference

- For each component below you'll find a short description, props (type, default, notes) and a minimal usage example.

## Animation Control

Most components support an `animate?: boolean` prop to enable or disable built-in Framer Motion animations. The default is `true`.

```jsx
import { Button, Modal } from '@stackloop/ui'

<Button animate={false}>No animation</Button>

<Modal isOpen={open} onClose={() => setOpen(false)} animate={false}>
  ...
</Modal>
```

Components with the `animate` prop:

- `Accordion`, `AudioRecorder`, `Badge`, `BottomSheet`, `Button`, `ButtonGroup`, `Card`, `CameraCapture`, `Checkbox`, `CountrySelect`, `DatePicker`, `Drawer`, `Dropdown`, `DualSlider`, `FileUploader`, `FloatingActionButton`, `Input`, `Modal`, `MultiSelect`, `Pagination`, `PhoneInput`, `RadioPills`, `Select`, `Slider`, `Spinner`, `StepProgress`, `Table`, `Textarea`, `ThumbnailGrid`, `Toggle`, `ToastProvider`

## Ripple Behavior

Ripple effects are **opt-in**. Initialize them once in your app entry file.

```tsx
// main.tsx or index.tsx
import { setupRippleEffects } from '@stackloop/ui'

setupRippleEffects()
```

After setup, ripple can apply to interactive elements (`button`, `a`, `[role="button"]`, and elements with `data-ripple="true"`).

- Disable ripple for a specific element:

  ```html
  <button data-ripple="false">No ripple</button>
  ```

- Force ripple on a custom/non-button element:

  ```html
  <div role="button" data-ripple="true">Ripple enabled</div>
  ```

Call `setupRippleEffects()` only once per app (for example in `main.tsx`) to avoid duplicate global listeners.

**Checkbox**:
- **Description:** Accessible checkbox with optional label and description.
- **Props:**
  - **`label`**: `string` — optional.
  - **`description`**: `string` — optional.
  - **`onChange`**: `(checked: boolean) => void` — optional.
  - **`className`**: `string` — optional.
  - Inherits standard `input` props (e.g. `disabled`, `defaultChecked`, `checked`).
- **Usage:**

  ```jsx
  import { Checkbox } from '@stackloop/ui'

  <Checkbox label="Accept terms" onChange={(v) => console.log(v)} />
  ```

**Button**:
- **Description:** Animated button with variants, sizes, icons and loading state.
- **Props:**
  - **`variant`**: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` — default: `'primary'`.
  - **`size`**: `'sm' | 'md' | 'lg'` — default: `'md'`.
  - **`loading`**: `boolean` — default: `false`.
  - **`icon`**: `ReactNode` — optional.
  - **`className`**: `string` — optional.
  - Inherits standard `button` props.
- **Usage:**

  ```jsx
  import { Button } from '@stackloop/ui'

  <Button variant="outline" size="lg" onClick={() => {}}>Save</Button>
  ```

**ButtonGroup**:
- **Description:** Segmented button group with a rounded outer container and separate buttons divided by borders.
- **Props:**
  - **`options`**: `ButtonGroupOption[]` — required.
    - `value`: `string` — required unique option value.
    - `label`: `string` — required fallback text label.
    - `icon`: `ReactNode` — optional leading icon.
    - `disabled`: `boolean` — optional per-option disabled state.
    - `className`: `string` — optional per-option class override.
    - `ariaLabel`: `string` — optional aria-label for accessibility.
    - `render`: `(option, state) => ReactNode` — optional custom content renderer. If omitted, the default icon + label layout is used.
    - `onClick`: `(option, event) => void` — optional per-option click callback.
  - **`value`**: `string` — optional selected value.
  - **`onChange`**: `(value: string) => void` — optional change callback.
  - **`onOptionClick`**: `(option, index) => void` — optional group-level callback for any option click.
  - **`size`**: `'sm' | 'md' | 'lg'` — default: `'md'`.
  - **`disabled`**: `boolean` — default: `false`.
  - **`className`**: `string` — optional.
  - **`animate`**: `boolean` — default: `true`.
- **Usage:**

  ```jsx
  import { ButtonGroup } from '@stackloop/ui'

  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ]

  <ButtonGroup
    options={options}
    value={selectedRange}
    onChange={setSelectedRange}
  />

  // Custom render + per-option and group-level click hooks
  const customOptions = [
    {
      label: 'Overview',
      value: 'overview',
      render: (option, state) => (
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">View</span>
          <span className={state.selected ? 'font-semibold' : 'font-medium'}>{option.label}</span>
        </span>
      ),
      onClick: (option) => console.log('Option clicked:', option.value)
    },
    { label: 'Details', value: 'details' },
    { label: 'Activity', value: 'activity' }
  ]

  <ButtonGroup
    options={customOptions}
    value={selectedView}
    onChange={setSelectedView}
    onOptionClick={(option, index) => {
      console.log('Group handler:', option.value, index)
    }}
  />
  ```

**Input**:
- **Description:** Unified input API with smart type routing. Supports native text/password/email/etc plus `phone`, `country`, and `date` while keeping a consistent `value` + `onChange` pattern.
- **Props:**
  - **`type`**: Native HTML input types plus `'phone' | 'tel' | 'country'`.
    - `type="date"` renders the library `DatePicker`.
    - `type="country"` renders `CountrySelect`.
    - `type="phone"` and `type="tel"` render `PhoneInput`.
  - **`value`**: `string | number | readonly string[] | Date`.
  - **`onChange`**: `(value: string | Date) => void` — value-based callback used consistently across smart/native modes.
  - **`onValueChange`**: `(value: string | Date) => void` — optional backward-compatible alias.
  - **`label`**: `string` — optional.
  - **`error`**: `string` — optional.
  - **`hint`**: `string` — optional.
  - **`leftIcon`** / **`rightIcon`**: `ReactNode` — optional.
  - **`className`**: `string` — optional.
  - Inherits most `input` HTML attributes.
- **Features:**
  - **Password Toggle:** When `type="password"`, automatically displays an Eye/EyeOff icon to toggle password visibility. This overrides any custom `rightIcon`.
  - **Consistent Value API:** Same controlled pattern for text, phone, country, and date.
  - **Lightweight Composition:** Smart types reuse existing specialized components instead of duplicating logic.
  - **Icon Support:** Display icons on left or right side of input
  - **Validation:** Built-in error and hint display
  - **Accessibility:** Proper labels and ARIA attributes
- **Usage:**

  ```jsx
  import { Input } from '@stackloop/ui'

  <Input label="Email" placeholder="you@example.com" />
  <Input label="Phone" type="phone" value={phone} onChange={setPhone} />
  <Input label="Telephone" type="tel" value={phone} onChange={setPhone} />
  
  // Password with automatic toggle
  <Input label="Password" type="password" placeholder="Enter password" />


- **Compatibility note:** Regular HTML input types still render a native `<input />`, so existing usage such as `type="email"`, `type="number"`, and `type="text"` remains unchanged.
  // Phone (single combined value)
  <Input
    label="Phone"
    type="phone"
    value={phone}
    onChange={(nextValue) => setPhone(String(nextValue))}
  />

  // Country
  <Input
    label="Country"
    type="country"
    value={country}
    onChange={(nextValue) => setCountry(String(nextValue))}
  />

  // Date
  <Input
    label="Date"
    type="date"
    value={selectedDate}
    onChange={(nextValue) => {
      if (nextValue instanceof Date) setSelectedDate(nextValue)
    }}
  />
  
  // With icons
  <Input 
    label="Search" 
    leftIcon={<Search />} 
    placeholder="Search..." 
  />
  ```

**PhoneInput**:
- **Description:** Phone input with country selector and a single editable value field (country code + number in the same input).
- **Props:**
  - **`value`**: `string` — optional.
  - **`onChange`**: `(value: string) => void` — optional.
  - **`country`**: `string` — optional ISO2 override (e.g. `US`).
  - **`defaultCountry`**: `string` — default: `'US'`.
  - **`autoDetect`**: `boolean` — default: `true`. Uses `navigator.language` to select a country.
  - **`onCountryChange`**: `(country: Country) => void` — optional.
  - **`label`**: `string` — optional.
  - **`required`**: `boolean` — optional. Shows a required marker (`*`) on label and passes `required` to the inner input.
  - **`error`**: `string` — optional. Shows error state and helper text.
  - **`hint`**: `string` — optional. Shown only when `error` is not present.
  - **`searchable`**: `boolean` — default: `true`.
  - **`showFlags`**: `boolean` — default: `true`.
  - **`animate`**: `boolean` — default: `true`.
  - **`className`**: `string` — optional.
  - Inherits standard `input` HTML attributes.
- **Behavior:**
  - Default selected country auto-fills dial code when the input is empty.
  - User can edit/delete the dial code directly in the same input.
  - Dropdown opens up or down based on available viewport space.
- **Usage:**

  ```jsx
  import { PhoneInput } from '@stackloop/ui'

  <PhoneInput
    label="Phone"
    value={phone}
    onChange={setPhone}
    required
    hint="Include area code"
    searchable
    autoDetect
  />
  ```

**CountrySelect**:
- **Description:** Country selector built on `Select` with optional flags and search.
- **Props:**
  - **`value`**: `string` — optional (ISO2, e.g. `US`).
  - **`onChange`**: `(value: string) => void` — optional.
  - **`onCountryChange`**: `(country: Country) => void` — optional.
  - **`label`**: `string` — optional.
  - **`required`**: `boolean` — optional. Shows a required marker (`*`) and `aria-required` on trigger.
  - **`placeholder`**: `string` — optional.
  - **`error`**: `string` — optional. Adds error border/ring and error message.
  - **`hint`**: `string` — optional. Shown only when `error` is not present.
  - **`searchable`**: `boolean` — default: `true`.
  - **`clearable`**: `boolean` — default: `true`.
  - **`showFlags`**: `boolean` — default: `true`.
  - **`disabled`**: `boolean` — optional.
  - **`animate`**: `boolean` — default: `true`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { CountrySelect } from '@stackloop/ui'

  <CountrySelect
    label="Country"
    value={country}
    onChange={setCountry}
    required
    hint="Used for regional formatting"
    searchable
  />
  ```

**Modal**:
- **Description:** Centered modal with backdrop, title and Escape-to-close handling.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`children`**: `ReactNode` — required.
  - **`title`**: `string` — optional.
  - **`size`**: `'sm'|'md'|'lg'|'xl'|'full'` — default: `'md'`.
  - **`className`**: `string` — optional.
- **Subcomponents:** `ModalContent`, `ModalFooter`.
- **Usage:**

  ```jsx
  import { Modal, ModalContent, ModalFooter } from '@stackloop/ui'

  <Modal isOpen={open} onClose={() => setOpen(false)} title="My Modal">
    <ModalContent>Body</ModalContent>
    <ModalFooter>
      <button onClick={() => setOpen(false)}>Close</button>
    </ModalFooter>
  </Modal>
  ```

**Table**:
- **Description:** Generic sortable table component with loading skeleton, row interactions, and responsive design. Supports client-side sorting and custom cell rendering.
- **Props:**
  - **`data`**: `T[]` — required. Array of data items to display in the table.
  - **`columns`**: `Column<T>[]` — required. Array of column definitions (see Column interface below).
  - **`loading`**: `boolean` — optional. Shows animated skeleton loading state when true.
  - **`onRowClick`**: `(item: T) => void` — optional. Callback fired when a row is clicked. Adds hover effect and pointer cursor to rows.
  - **`keyExtractor`**: `(item: T) => string` — required. Function to extract unique key from each data item for React reconciliation.
  - **`selectable`**: `boolean` — optional (default: `false`). Adds a checkbox column with header-level select all and per-row selection.
  - **`selectedKeys`**: `string[]` — optional. Controlled selected row keys.
  - **`defaultSelectedKeys`**: `string[]` — optional. Initial selected row keys for uncontrolled mode.
  - **`onSelectionChange`**: `(selectedKeys: string[], selectedItems: T[]) => void` — optional. Fires whenever selection changes.
  - **`className`**: `string` — optional. Additional CSS classes for the table wrapper.

- **Column Interface:**
  ```typescript
  interface Column<T> {
    key: string;                         // Unique column identifier and default accessor key
    header: string;                      // Column header text displayed in table header
    sortable?: boolean;                  // Enable sorting for this column (default: false)
    render?: (item: T) => React.ReactNode; // Custom render function - can return any valid React element
    width?: string;                      // CSS width value (e.g., '100px', '20%', 'auto')
    truncate?: boolean;                  // Enable text truncation with ellipsis for long content (default: false)
  }
  ```

- **Custom Rendering with `render`:**
  
  The `render` function accepts the current row item and can return **any React node**, including:
  - JSX elements (buttons, badges, icons)
  - Formatted strings or numbers
  - Complex components with conditional logic
  - Nested elements with multiple components
  
  **Examples:**

  ```jsx
  // Render Badge components
  {
    key: 'status',
    header: 'Status',
    render: (item) => (
      <Badge variant={item.status === 'active' ? 'success' : 'danger'}>
        {item.status}
      </Badge>
    )
  }

  // Render action buttons
  {
    key: 'actions',
    header: 'Actions',
    render: (item) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>Delete</Button>
      </div>
    )
  }

  // Render images with fallback
  {
    key: 'avatar',
    header: 'Avatar',
    render: (user) => (
      <img 
        src={user.avatar || '/default-avatar.png'} 
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
    )
  }

  // Render formatted dates
  {
    key: 'createdAt',
    header: 'Created',
    render: (item) => new Date(item.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Render icons with conditional colors
  {
    key: 'verified',
    header: 'Verified',
    render: (user) => user.verified ? (
      <Check className="w-5 h-5 text-success" />
    ) : (
      <X className="w-5 h-5 text-error" />
    )
  }

  // Render multiple values combined
  {
    key: 'fullName',
    header: 'User',
    render: (user) => (
      <div>
        <div className="font-semibold">{user.firstName} {user.lastName}</div>
        <div className="text-sm text-primary/60">{user.email}</div>
      </div>
    )
  }

  // Enable text truncation for long content
  {
    key: 'description',
    header: 'Description',
    truncate: true,      // Adds ellipsis when text exceeds cell width
    width: '300px'       // Set explicit width to control truncation point
  }
  ```

- **Text Truncation:**
  - Set `truncate: true` on any column to automatically truncate long text with ellipsis (`...`) when content exceeds the cell width.
  - Hovering over truncated cells shows a browser tooltip with the full text.
  - **Must specify `width`** property (e.g., `'200px'`, `'30%'`, `'20rem'`) to define when truncation occurs.
  - Without `width`, the cell will expand to fit content and truncation won't activate.
  - Only applies to default cell rendering; custom `render` functions handle their own truncation.
  
  **Example:**
  ```jsx
  const columns = [
    { key: 'title', header: 'Title', sortable: true },
    { 
      key: 'description', 
      header: 'Description', 
      truncate: true,        // Enable ellipsis
      width: '250px'         // Required: defines max width before truncation
    },
    { 
      key: 'email', 
      header: 'Email', 
      truncate: true,
      width: '200px'
    },
    { key: 'author', header: 'Author' }
  ]
  ```

- **Sorting Behavior:**
  - Click sortable column headers to toggle between ascending → descending → no sort.
  - Sort icons: `ChevronUp` (ascending), `ChevronDown` (descending), `ChevronsUpDown` (sortable but not active).
  - Sorting is client-side using JavaScript's `localeCompare` for strings and numeric comparison for numbers.
  - Only one column can be sorted at a time.

- **Loading State:**
  - When `loading={true}`, displays skeleton rows with animated gradient shimmer.
  - Shows 5 skeleton rows by default, preserving table structure and column widths.
  - Loading state prevents interactions and hides real data.

- **Styling & Customization:**
  - Responsive: Horizontal scroll on mobile, full table view on desktop.
  - Hover states: Rows have hover background when `onRowClick` is provided.
  - Colors: Uses semantic color tokens (`border`, `border-dark`, `background`, `foreground-color`, `primary`).
  - Animations: Powered by Framer Motion for smooth row entry and sorting transitions.

- **Complete Usage Example:**

  ```jsx
  import { Table, Badge, Button } from '@stackloop/ui'
  import { Check, X, Edit, Trash2 } from 'lucide-react'

  const columns = [
    { 
      key: 'id', 
      header: 'ID', 
      width: '80px',
      sortable: true 
    },
    { 
      key: 'name', 
      header: 'Name', 
      sortable: true 
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (user) => (
        <Badge variant={user.status === 'active' ? 'success' : 'default'}>
          {user.status}
        </Badge>
      )
    },
    {
      key: 'verified',
      header: 'Verified',
      render: (user) => user.verified ? 
        <Check className="w-5 h-5 text-success" /> : 
        <X className="w-5 h-5 text-error" />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          <Button size="sm" icon={<Edit />} onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" icon={<Trash2 />}>
            Delete
          </Button>
        </div>
      )
    }
  ]

  <Table 
    data={users} 
    columns={columns} 
    keyExtractor={(user) => String(user.id)}
    onRowClick={(user) => navigate(`/users/${user.id}`)}
    loading={isLoading}
  />
  ```

- **Selection Example:**

  ```jsx
  const [selectedRows, setSelectedRows] = useState([])

  <Table
    data={users}
    columns={columns}
    keyExtractor={(user) => String(user.id)}
    selectable
    selectedKeys={selectedRows}
    onSelectionChange={(keys, items) => {
      setSelectedRows(keys)
      console.log('Selected row IDs:', keys)
      console.log('Selected row objects:', items)
    }}
  />
  ```

**DropdownMenu**:
- **Description:** Headless-style dropdown menu primitive with custom trigger support, outside-click close behavior, and nested submenus.
- **Placement behavior:**
  - Root menu opens **down or up** based on viewport space (or can be forced).
  - Root menu opens **right or left** based on viewport space and will clamp inside the viewport to avoid horizontal overflow.
  - Nested submenus open **right or left** based on side space (or can be forced).
- **Use case:**
  - Nested navigation or action menus where each menu item can itself open another submenu.
  - Context menus launched from custom triggers like icon buttons, cards, or toolbar actions.
- **Core Components:**
  - **`DropdownMenu`**: Root wrapper with controlled/uncontrolled open state.
  - **`DropdownMenuTrigger`**: Trigger button or custom trigger with `asChild`.
  - **`DropdownMenuContent`**: Root menu panel.
  - **`DropdownMenuItem`**: Clickable item (button or custom child with `asChild`).
  - **`DropdownMenuSub`**: Nested menu wrapper.
  - **`DropdownMenuSubTrigger`**: Trigger for nested menu.
  - **`DropdownMenuSubContent`**: Nested panel.
- **Root Props (`DropdownMenu`):**
  - **`open`**: `boolean` — optional controlled state.
  - **`defaultOpen`**: `boolean` — default: `false`.
  - **`onOpenChange`**: `(open: boolean) => void` — optional callback.
  - **`placement`**: `'auto' | 'top' | 'bottom'` — default: `'auto'`.
  - **`className`**: `string` — optional.
- **Content Props (`DropdownMenuContent`):**
  - **`side`**: `'auto' | 'left' | 'right'` — default: `'auto'`. Controls root horizontal direction.
  - **`align`**: `'start' | 'end'` — default: `'start'`. Used as fallback preference when `side="auto"`.
  - **`sideOffset`**: `number` — default: `8`. Gap between trigger and content.
- **Usage:**

  ```jsx
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
  } from '@stackloop/ui'

  <DropdownMenu>
    <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
    <DropdownMenuContent side="auto">
      <DropdownMenuItem asChild>
        <a href="/dashboard">Dashboard</a>
      </DropdownMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Products</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem asChild>
            <a href="/products/new">New Arrivals</a>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Categories</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <a href="/products/categories/tools">Tools</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/products/categories/home">Home</a>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuItem onClick={() => console.log('Signed out')}>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  ```

**Tooltip**:
- **Description:** Portal-based tooltip for short hints and context text. It renders outside normal layout flow (so it does not affect element positioning), supports top/bottom/left/right placement, auto-flips when space is limited, and stays visible above overflow-clipped containers.
- **Props:**
  - **`children`**: `ReactNode` — required. Trigger element.
  - **`content`**: `ReactNode` — required. Tooltip body.
  - **`side`**: `'top' | 'bottom' | 'left' | 'right'` — preferred side (default: `'bottom'`).
  - **`offset`**: `number` — gap between trigger and tooltip (default: `10`).
  - **`delay`**: `number` — open delay in ms (default: `120`).
  - **`showArrow`**: `boolean` — default: `true`.
  - **`arrowSize`**: `number` — default: `10`.
  - **`open`**, **`defaultOpen`**, **`onOpenChange`** — controlled/uncontrolled visibility.
  - **`className`**, **`arrowClassName`**, **`disabled`** — optional styling/behavior controls.
- **Usage:**

  ```jsx
  import { Tooltip, Button } from '@stackloop/ui'

  <Tooltip content="More actions">
    <Button variant="ghost">Hover me</Button>
  </Tooltip>

  <Tooltip content="Delete item" side="top" showArrow>
    <Button variant="danger">Delete</Button>
  </Tooltip>
  ```

**Select**:
- **Description:** **Form-specific** select component with label, error, hint, and validation support. Specifically designed for use in forms with proper semantics, accessibility, and validation integration. Use this component when building forms. It includes form-focused features like `required`, hint text, and better integration with form libraries (React Hook Form, Formik, etc.).
- **Props:**
  - **`options`**: `{ value: string; label: string; icon?: ReactNode; disabled?: boolean }[]` — required. Array of selectable options with optional icons and disabled state.
  - **`value`**: `string` — optional. Currently selected value.
  - **`onChange`**: `(value: string) => void` — required. Callback fired when selection changes.
  - **`placeholder`**: `string` — default: `'Select an option'`. Shown when no value is selected.
  - **`label`**: `string` — optional. Label displayed above the select.
  - **`error`**: `string` — optional. Error message displayed below select with error styling.
  - **`hint`**: `string` — optional. Helper text displayed below select when no error is present.
  - **`searchable`**: `boolean` — default: `false`. Enables search input to filter options.
  - **`clearable`**: `boolean` — default: `true`. Shows clear button when value is selected.
  - **`required`**: `boolean` — optional. Displays asterisk (*) next to label and sets aria-required.
  - **`disabled`**: `boolean` — optional. Disables the select.
  - **`className`**: `string` — optional. Additional CSS classes for the wrapper.
- **Features:**
  - **Form Integration:** Works seamlessly with form libraries (React Hook Form, Formik, etc.)
  - **Validation Support:** Built-in error and hint display with animated transitions
  - **Accessibility:** Full ARIA attributes, keyboard navigation, and screen reader support
  - **Search:** Optional searchable mode with real-time filtering
  - **Icons:** Support for icons in options for better visual recognition
  - **Disabled Options:** Individual options can be disabled while keeping select active
  - **Clearable:** Optional clear button to reset selection
  - **Touch-Friendly:** Optimized for mobile with proper touch targets
- **Usage:**

  ```jsx
  import { Select } from '@stackloop/ui'
  import { User, Settings, Bell } from 'lucide-react'

  // Basic usage
  <Select 
    label="Country"
    options={[
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' }
    ]} 
    value={country} 
    onChange={setCountry}
    required
  />

  // With icons and search
  <Select 
    label="Navigation"
    options={[
      { value: 'profile', label: 'Profile', icon: <User /> },
      { value: 'settings', label: 'Settings', icon: <Settings /> },
      { value: 'notifications', label: 'Notifications', icon: <Bell />, disabled: true }
    ]}
    value={selected}
    onChange={setSelected}
    searchable
    placeholder="Choose a page"
  />

  // With error and hint
  <Select 
    label="Payment Method"
    options={paymentMethods}
    value={payment}
    onChange={setPayment}
    error={errors.payment}
    hint="Select your preferred payment method"
    required
  />

  // With React Hook Form
  import { useForm, Controller } from 'react-hook-form'

  const { control, formState: { errors } } = useForm()

  <Controller
    name="category"
    control={control}
    rules={{ required: 'Category is required' }}
    render={({ field }) => (
      <Select
        label="Category"
        options={categories}
        value={field.value}
        onChange={field.onChange}
        error={errors.category?.message}
        required
      />
    )}
  />
  ```

**MultiSelect**:
- **Description:** Multi-select component that allows selecting multiple items with chips display. Each selected item appears as a removable chip with an X button. Perfect for selecting multiple options like staff members, tags, skills, etc.
- **Props:**
  - **`options`**: `{ value: string; label: string; icon?: ReactNode; disabled?: boolean }[]` — required. Array of selectable options with optional icons and disabled state.
  - **`value`**: `string[]` — optional. Array of currently selected values (default: `[]`).
  - **`onChange`**: `(values: string[]) => void` — required. Callback fired when selections change, receives array of selected values.
  - **`placeholder`**: `string` — default: `'Select options...'`. Shown when no items are selected.
  - **`label`**: `string` — optional. Label displayed above the multi-select.
  - **`error`**: `string` — optional. Error message displayed below with error styling.
  - **`hint`**: `string` — optional. Helper text displayed below when no error is present.
  - **`searchable`**: `boolean` — default: `false`. Enables search input to filter options.
  - **`clearable`**: `boolean` — default: `true`. Shows "Clear all" option in dropdown when items are selected.
  - **`maxItems`**: `number` — optional. Maximum number of items that can be selected.
  - **`chipVariant`**: `'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'` — default: `'primary'`. Styles for the selected item chips.
  - **`required`**: `boolean` — optional. Displays asterisk (*) next to label and sets aria-required.
  - **`disabled`**: `boolean` — optional. Disables the multi-select.
  - **`className`**: `string` — optional. Additional CSS classes for the wrapper.
- **Features:**
  - **Chips Display:** Selected items show as removable chips with X buttons inline in the button
  - **Multi-Select:** Choose multiple items from a list with checkboxes in the dropdown
  - **Form Integration:** Works seamlessly with form libraries (React Hook Form, Formik, etc.)
  - **Validation Support:** Built-in error and hint display with animated transitions
  - **Accessibility:** Full ARIA attributes, keyboard navigation, and screen reader support
  - **Search:** Optional searchable mode with real-time filtering across all options
  - **Icons:** Support for icons in options for better visual recognition
  - **Disabled Options:** Individual options can be disabled
  - **Max Items:** Optional limit on the number of items that can be selected
  - **Clear All:** "Clear all" button in dropdown to remove all selected items at once
  - **Remove Individual:** Click X on any chip to remove just that item
  - **Touch-Friendly:** Optimized for mobile with proper touch targets
- **Usage:**

  ```jsx
  import { MultiSelect } from '@stackloop/ui'
  import { Users, Award, Code } from 'lucide-react'

  // Basic multi-select for team members
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])

  <MultiSelect 
    label="Select Staff Members"
    options={[
      { value: 'john', label: 'John Doe' },
      { value: 'jane', label: 'Jane Smith' },
      { value: 'bob', label: 'Bob Johnson' }
    ]} 
    value={selectedStaff}
    onChange={setSelectedStaff}
    placeholder="Choose staff members..."
    required
  />

  // With icons and search
  <MultiSelect 
    label="Skills"
    options={[
      { value: 'react', label: 'React', icon: <Code /> },
      { value: 'vue', label: 'Vue.js', icon: <Code /> },
      { value: 'angular', label: 'Angular', icon: <Code /> },
      { value: 'node', label: 'Node.js', icon: <Code /> }
    ]}
    value={skills}
    onChange={setSkills}
    searchable
    placeholder="Select your skills"
  />

  // With max items limit and chip styling
  <MultiSelect 
    label="Team Members (Max 5)"
    options={teamMembers}
    value={selectedTeam}
    onChange={setSelectedTeam}
    maxItems={5}
    chipVariant="primary"
    error={errors.team}
    hint="Select up to 5 team members for this project"
  />

  // With React Hook Form
  import { useForm, Controller } from 'react-hook-form'

  const { control, formState: { errors } } = useForm()

  <Controller
    name="assignees"
    control={control}
    rules={{ validate: (v) => v?.length > 0 || 'Please select at least one assignee' }}
    render={({ field }) => (
      <MultiSelect
        label="Assign to"
        options={users}
        value={field.value || []}
        onChange={field.onChange}
        error={errors.assignees?.message}
        searchable
        required
      />
    )}
  />
  ```

**BottomSheet**:
- **Description:** Mobile bottom sheet with header and optional close button.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`title`**: `string` — optional.
  - **`children`**: `ReactNode` — required.
  - **`showCloseButton`**: `boolean` — default: `true`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { BottomSheet } from '@stackloop/ui'

  <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Actions">...</BottomSheet>
  ```

**DatePicker**:
- **Description:** Date picker with day grid, min/max date constraints, and fast custom month/year pickers.
- **Props:**
  - **`value`**: `Date` — optional.
  - **`onChange`**: `(date: Date) => void` — required.
  - **`label`**: `string` — optional.
  - **`required`**: `boolean` — optional. Shows required marker (`*`) and `aria-required`.
  - **`placeholder`**: `string` — default: `'Select date'`.
  - **`error`**: `string` — optional.
  - **`hint`**: `string` — optional. Shown only when `error` is not present.
  - **`disabled`**: `boolean` — optional.
  - **`minDate`** / **`maxDate`**: `Date` — optional.
  - **`animate`**: `boolean` — default: `true`.
  - **`className`**: `string` — optional.
- **Features:**
  - **Custom Month Menu:** Scrollable month dropdown/dropup (no native browser select).
  - **Custom Year Menu:** Scrollable year dropdown/dropup that supports quick jumps across many years.
  - **Adaptive Positioning:** Month/year menus open upward when there is insufficient viewport space below.
- **Usage:**

  ```jsx
  import { DatePicker } from '@stackloop/ui'

  <DatePicker
    label="Date of birth"
    value={date}
    onChange={setDate}
    required
    hint="Choose month/year quickly from the menu"
  />
  ```

**DualSlider**:
- **Description:** Two linked sliders showing relative portions.
- **Props:**
  - **`value1`**, **`value2`**: `number` — required.
  - **`onChange`**: `(v1:number, v2:number)=>void` — required.
  - **`label1`**, **`label2`**: `string` — required.
  - **`min`** (default `0`), **`max`** (default `100`), **`step`** (default `1`), **`unit`** (default `'%')`, **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { DualSlider } from '@stackloop/ui'

  <DualSlider value1={30} value2={70} onChange={(a,b)=>{}} label1="A" label2="B" />
  ```

**Pagination**:
- **Description:** Pagination with previous/next and numeric buttons.
- **Props:**
  - **`currentPage`**: `number` — required.
  - **`totalPages`**: `number` — required.
  - **`onPageChange`**: `(page:number)=>void` — required.
  - **`totalItems`**, **`itemsPerPage`**, **`className`** — optional.
- **Usage:**

  ```jsx
  import { Pagination } from '@stackloop/ui'

  <Pagination currentPage={1} totalPages={10} onPageChange={setPage} />
  ```

**Badge**:
- **Description:** Inline badge with color variants and optional dot.
- **Props:**
  - **`children`**: `ReactNode` — required.
  - **`variant`**: `'default'|'primary'|'success'|'warning'|'danger'|'info'` — default: `'default'`.
  - **`size`**: `'sm'|'md'|'lg'` — default: `'md'`.
  - **`dot`**: `boolean` — default: `false`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { Badge } from '@stackloop/ui'

  <Badge variant="primary">New</Badge>
  ```

**Spinner**:
- **Description:** Animated loading spinner with size variants and optional label.
- **Props:**
  - **`size`**: `'sm' | 'md' | 'lg' | 'xl'` — default: `'md'`. Controls spinner dimensions (sm=16px, md=32px, lg=48px, xl=64px).
  - **`variant`**: `'primary' | 'secondary' | 'white'` — default: `'primary'`. Color variant of the spinner.
  - **`label`**: `string` — optional. Text displayed below spinner.
  - **`className`**: `string` — optional. Additional CSS classes for the wrapper.
- **Usage:**

  ```jsx
  import { Spinner } from '@stackloop/ui'

  // Basic spinner
  <Spinner />

  // With label
  <Spinner label="Loading..." />

  // Custom size and variant
  <Spinner size="lg" variant="white" />

  // In a button
  <Button disabled>
    <Spinner size="sm" variant="white" label="Processing..." />
  </Button>
  ```

**Toast**:
- **Description:** Context-based toast notification system with variants, actions, and customizable positioning. Provides non-intrusive feedback messages that auto-dismiss.
- **Components:**
  - **`ToastProvider`**: Wrapper component that manages toast state and rendering. Must wrap your app or components that use toasts.
  - **`useToast`**: Hook to trigger toasts from any component within the provider.
- **ToastProvider Props:**
  - **`children`**: `ReactNode` — required. Your app content.
  - **`position`**: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` — default: `'top-right'`. Where toasts appear on screen.
  - **`maxToasts`**: `number` — default: `5`. Maximum number of toasts shown at once.
- **useToast() Returns:**
  - **`addToast(toast)`**: Function to create a new toast notification.
  - **`removeToast(id)`**: Function to manually dismiss a toast.
  - **`toasts`**: Array of currently active toasts.
- **Toast Object:**
  - **`message`**: `string` — required. Toast content text.
  - **`variant`**: `'success' | 'error' | 'warning' | 'info' | 'default'` — optional (default: `'default'`). Visual style with corresponding icon.
  - **`duration`**: `number` — optional (default: `5000`ms). Auto-dismiss time in milliseconds. Set to `0` for persistent toast.
  - **`action`**: `{ label: string; onClick: () => void }` — optional. Action button within the toast.
- **Features:**
  - **Auto-dismiss**: Toasts automatically disappear after duration
  - **Manual dismiss**: Click X button or call `removeToast(id)`
  - **Variants with icons**: Visual feedback with CheckCircle, AlertCircle, AlertTriangle, Info icons
  - **Action buttons**: Add clickable actions to toasts
  - **Animations**: Smooth enter/exit animations with Framer Motion
  - **Position control**: Place toasts anywhere on screen
  - **Max limit**: Prevents toast overflow
  - **Responsive**: Adapts to mobile screens
- **Usage:**

  ```jsx
  import { ToastProvider, useToast } from '@stackloop/ui'

  // 1. Wrap your app with ToastProvider
  function App() {
    return (
      <ToastProvider position="top-right" maxToasts={5}>
        <YourApp />
      </ToastProvider>
    )
  }

  // 2. Use toasts in any component
  function MyComponent() {
    const { addToast } = useToast()

    const handleSuccess = () => {
      addToast({
        message: 'Profile updated successfully!',
        variant: 'success',
        duration: 3000
      })
    }

    const handleError = () => {
      addToast({
        message: 'Failed to save changes',
        variant: 'error',
        duration: 5000
      })
    }

    const handleWithAction = () => {
      addToast({
        message: 'New message received',
        variant: 'info',
        duration: 0, // Persistent until dismissed
        action: {
          label: 'View',
          onClick: () => navigate('/messages')
        }
      })
    }

    const handleWarning = () => {
      addToast({
        message: 'Your session will expire in 5 minutes',
        variant: 'warning'
      })
    }

    return (
      <div>
        <Button onClick={handleSuccess}>Save</Button>
        <Button onClick={handleError}>Trigger Error</Button>
        <Button onClick={handleWithAction}>Show Notification</Button>
        <Button onClick={handleWarning}>Show Warning</Button>
      </div>
    )
  }

  // 3. Bottom-centered positioning
  <ToastProvider position="bottom-center">
    <App />
  </ToastProvider>
  ```

**FloatingActionButton (FAB)**:
- **Description:** Floating action button with expanded action list support.
- **Props:**
  - **`icon`**, **`label`**, **`onClick`**, **`actions`** (array of `{label, icon, onClick, variant, labelClassName?, labelStyle?}`) — optional.
  - **`variant`**: `'primary'|'secondary'` — default: `'primary'`.
  - **`position`**: `'bottom-right'|'bottom-left'|'bottom-center'` — default: `'bottom-right'`.
  - **`disabled`**, **`className`**.
- **Action Props:**
  - **`label`**: `string` — Action label text.
  - **`icon`**: `ReactNode` — Icon for the action button.
  - **`onClick`**: `() => void` — Action callback.
  - **`variant`**: `'primary'|'success'|'danger'|'warning'` — Action button color variant.
  - **`labelClassName`**: `string` — Custom CSS classes for the label (e.g., remove background: `'!bg-transparent !border-0 text-white'`).
  - **`labelStyle`**: `CSSProperties` — Inline styles for the label.
- **Usage:**

  ```jsx
  import { FloatingActionButton as FAB } from '@stackloop/ui'

  // Simple FAB
  <FAB label="New" onClick={()=>{}} />

  // FAB with actions and custom label styling
  <FAB 
    actions={[
      {
        label: 'Create Post',
        icon: <PlusIcon />,
        onClick: () => {},
        variant: 'primary',
        labelClassName: 'bg-blue-500 text-white border-blue-600'
      },
      {
        label: 'Upload',
        icon: <UploadIcon />,
        onClick: () => {},
        variant: 'success',
        labelClassName: '!bg-transparent !border-0 text-white shadow-none'
      }
    ]}
  />
  ```

**AudioRecorder**:
- **Description:** Browser audio recorder component using MediaRecorder.
- **Props:**
  - **`onRecordingComplete`**: `(audioBlob: Blob) => void` — required.
  - **`label`**: `string` — default: `'Record Audio'`.
  - **`maxDuration`**: `number` — default: `300` seconds.
  - **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { AudioRecorder } from '@stackloop/ui'

  <AudioRecorder onRecordingComplete={(blob)=>{ /* handle */ }} />
  ```

**Drawer**:
- **Description:** Side drawer that slides in from the left or right.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`children`**: `ReactNode` — required.
  - **`title`**: `string` — optional.
  - **`position`**: `'left'|'right'` — default: `'right'`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { Drawer } from '@stackloop/ui'

  <Drawer isOpen={open} onClose={()=>setOpen(false)} title="Menu">...</Drawer>
  ```

**Toggle**:
- **Description:** Switch control with label and description.
- **Props:**
  - **`label`**: `string` — optional.
  - **`description`**: `string` — optional.
  - **`onChange`**: `(checked:boolean)=>void` — optional.
  - **`className`**: `string` — optional.
  - Inherits input attributes such as `checked`, `disabled`.
- **Usage:**

  ```jsx
  import { Toggle } from '@stackloop/ui'

  <Toggle label="Enable" onChange={(v)=>console.log(v)} />
  ```

**StatusBadges** (OfflineBadge, SyncIndicator):
- **OfflineBadge Props:** `isOffline: boolean` (required), `className?: string`.
- **SyncIndicator Props:** `status: 'synced'|'syncing'|'unsynced'|'error'` (required), `count?: number`, `className?: string`.
- **Usage:**

  ```jsx
  import { OfflineBadge, SyncIndicator } from '@stackloop/ui'

  <OfflineBadge isOffline={true} />
  <SyncIndicator status="syncing" />
  ```

**Slider**:
- **Description:** Single-value slider with optional unit and label.
- **Props:**
  - **`value`**: `number` — required.
  - **`onChange`**: `(value:number)=>void` — required.
  - **`min`** (default `0`), **`max`** (default `100`), **`step`** (default `1`), **`label`**, **`showValue`** (default `true`), **`unit`** (default `'%')`, **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { Slider } from '@stackloop/ui'

  <Slider value={50} onChange={setValue} />
  ```

**RadioPills**:
- **Description:** Radio group styled as pill buttons.
- **Props:**
  - **`options`**: `{ value: string; label: string; icon?: ReactNode }[]` — required.
  - **`value`**: `string` — optional.
  - **`onChange`**: `(v:string)=>void` — optional.
  - **`name`**: `string` — required.
  - **`disabled`**: `boolean` — optional.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { RadioPills } from '@stackloop/ui'

  <RadioPills name="mode" options={[{value:'a',label:'A'}]} />
  ```

**Textarea**:
- **Description:** Multiline input with label, error and helper text.
- **Props:**
  - **`label`**: `string` — optional.
  - **`error`**: `string` — optional.
  - **`helperText`**: `string` — optional.
  - **`className`**: `string` — optional.
  - Inherits native `textarea` attributes.
- **Usage:**

  ```jsx
  import { Textarea } from '@stackloop/ui'

  <Textarea label="Message" helperText="Max 500 chars" />
  ```

**ThumbnailGrid**:
- **Description:** Grid to display thumbnails for images, documents, audio with optional remove/view actions.
- **Props:**
  - **`items`**: `{ id, name, url, type:'image'|'document'|'audio', size? }[]` — required.
  - **`onRemove`**: `(id:string)=>void` — optional.
  - **`onView`**: `(item)=>void` — optional.
  - **`columns`**: `2|3|4` — default: `3`.
  - **`className`**.
- **Usage:**

  ```jsx
  import { ThumbnailGrid } from '@stackloop/ui'

  <ThumbnailGrid items={items} onRemove={(id)=>{}} />
  ```

**Accordion**:
- **Description:** Expandable/collapsible content sections with smooth animations. Supports single or multiple open items with customizable styling.
- **Props:**
  - **`items`**: `{ id: string; title: string|ReactNode; content: string|ReactNode; disabled?: boolean; icon?: ReactNode }[]` — required.
  - **`variant`**: `'default'|'bordered'` — default: `'default'`. Controls border styling (top border only for default, full border for bordered).
  - **`allowMultiple`**: `boolean` — default: `false`. When `false`, only one item can be open at a time. When `true`, multiple items can be open.
  - **`defaultOpen`**: `string[]` — default: `[]`. Array of item IDs that should be open initially.
  - **`onChange`**: `(openItems: string[]) => void` — optional. Called whenever the open state changes.
  - **`className`**: `string` — optional.
- **Features:**
  - Smooth height and opacity animations on expand/collapse using Framer Motion.
  - No rounded borders, only border-top styling for clean appearance.
  - Optional icons support for each accordion item.
  - Disabled state support for individual items.
  - Hover effects and smooth transitions.
- **Usage:**

  ```jsx
  import { Accordion } from '@stackloop/ui'

  // Single open mode (default)
  <Accordion
    items={[
      {
        id: 'item1',
        title: 'Question 1',
        content: 'Answer 1'
      },
      {
        id: 'item2',
        title: 'Question 2',
        content: 'Answer 2'
      }
    ]}
    defaultOpen={['item1']}
  />

  // Multiple open mode
  <Accordion
    items={[
      {
        id: 'section1',
        title: 'Section 1',
        content: 'Content 1',
        icon: <Icon />
      },
      {
        id: 'section2',
        title: 'Section 2',
        content: 'Content 2'
      }
    ]}
    allowMultiple={true}
    defaultOpen={['section1']}
    onChange={(openItems) => console.log(openItems)}
  />
  ```

**Card**:
- **Description:** Generic card container with variants and content subcomponents.
- **Props:**
  - **`children`**: `ReactNode` — required.
  - **`variant`**: `'default'|'outlined'|'elevated'` — default: `'default'`.
  - **`padding`**: `'sm'|'md'|'lg'|'none'` — default: `'md'`.
  - **`onClick`**: `() => void` — optional.
  - **`hover`**: `boolean` — default: `false`.
  - **`className`**: `string` — optional.
- **Subcomponents:** `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`.
- **Usage:**

  ```jsx
  import { Card, CardTitle, CardContent } from '@stackloop/ui'

  <Card variant="elevated"> <CardTitle>Title</CardTitle> <CardContent>Body</CardContent> </Card>
  ```

**FileUpload (CameraCapture, FileUploader)**:
- **CameraCapture Props:** `onCapture(file:File) => void` (required), `onRemove?`, `preview?`, `label?`, `disabled?`, `className?`.
- **FileUploader Props:** `onUpload(files:File[]) => void` (required), `accept?` (default `'*/*'`), `multiple?` (default `false`), `label?`, `disabled?`, `className?`.
- **Usage:**

  ```jsx
  import { FileUploader, CameraCapture } from '@stackloop/ui'

  <FileUploader onUpload={(files)=>{}} multiple accept="image/*" />
  <CameraCapture onCapture={(file)=>{}} />
  ```

**StepProgress**:
- **Description:** Horizontal stepper (desktop) and compact dots view (mobile) showing progress.
- **Props:**
  - **`steps`**: `{ label: string; description?: string }[]` — required.
  - **`currentStep`**: `number` — required.
  - **`className`**: optional.
- **Usage:**

  ```jsx
  import { StepProgress } from '@stackloop/ui'

  <StepProgress steps={[{label:'One'},{label:'Two'}]} currentStep={1} />
  ```

**CreditBar**:
- **Description:** Thin footer attribution bar for showing developer/company credit. Perfect for "Built with ❤️ by..." displays.
- **Props:**
  - **`text`**: `string` — default: `'Built by StackLoop'`. The company/developer name to display.
  - **`showHeart`**: `boolean` — default: `true`. Shows heart emoji in "Built with ❤️ by..." format.
  - **`href`**: `string` — optional. Link URL to make the credit clickable.
  - **`position`**: `'fixed' | 'relative' | 'sticky'` — default: `'fixed'`. Positioning of the bar.
  - **`backgroundColor`**: `string` — default: `'bg-gray-900'`. Tailwind background class.
  - **`textColor`**: `string` — default: `'text-gray-400'`. Tailwind text color class.
  - **`className`**: `string` — optional. Additional CSS classes.
- **Usage:**

  ```jsx
  import { CreditBar } from '@stackloop/ui'

  // Simple usage with heart
  <CreditBar text="StackLoop" />
  // Displays: "Built with ❤️ by StackLoop"

  // With link
  <CreditBar text="StackLoop" href="https://stackloop.com" />

  // Without heart
  <CreditBar text="Your Company" showHeart={false} />

  // Custom styling
  <CreditBar 
    text="StackLoop"
    backgroundColor="bg-blue-900"
    textColor="text-blue-300"
    position="sticky"
  />
  ```

---

## Next.js Best Practices

### App Router

All components work seamlessly with Next.js 13+ App Router. They include the `'use client'` directive:

```tsx
// app/page.tsx
import { Button, Card } from '@stackloop/ui'

export default function Page() {
  return (
    <div>
      <Card>
        <Button onClick={() => console.log('clicked')}>Click me</Button>
      </Card>
    </div>
  )
}
```

### Server Components

To use these components with Server Components, import them in client components:

```tsx
// components/ClientWrapper.tsx
'use client'
import { Button } from '@stackloop/ui'

export function ClientButton() {
  return <Button onClick={() => alert('Hello')}>Click</Button>
}
```

```tsx
// app/page.tsx (Server Component)
import { ClientButton } from '@/components/ClientWrapper'

export default function Page() {
  return <ClientButton />
}
```

### Styling Considerations

- The library uses Tailwind CSS v4 with `@theme` directive
- Ensure your Next.js project is configured for Tailwind CSS v4
- All animations use Framer Motion and are optimized for performance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Audio recording requires MediaRecorder API support

## License

MIT

---

For questions, issues, or contributions, please visit the [GitHub repository](https://github.com/AtutiBonface/@stackloop/ui).
