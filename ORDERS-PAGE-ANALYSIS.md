# Orders Page - Comprehensive Analysis

## 📋 Overview
The Orders page is the main page where washermen can view, filter, search, and manage their laundry bags/orders. It's the landing page after login.

---

## 🏗️ Page Structure

### Main Component: `Orders.tsx`
**Location:** `/src/pages/Orders.tsx`
**Lines:** 475 total

---

## 📊 State Management

```tsx
// Page-level States
const [orders, setOrders] = useState<Order[]>([]);              // All fetched orders
const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Orders after filter/search
const [loading, setLoading] = useState(true);                   // Loading state
const [error, setError] = useState<string | null>(null);        // Error messages
const [searchQuery, setSearchQuery] = useState('');             // Raw search input
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // Debounced search (300ms)

// Filter State
const [activeFilter, setActiveFilter] = useState<FilterStatus>('pending'); // Current filter
// Type: 'pending' | 'inprogress' | 'complete'

// Modal State
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Order in modal
const [isModalOpen, setIsModalOpen] = useState(false);          // Modal visibility

// Pagination State
const [currentPage, setCurrentPage] = useState(1);              // Current page
const [itemsPerPage] = useState(10);                            // 10 items per page
```

---

## 🎯 Key Features

### 1. **Search Functionality**
- **Implementation:** Input field with live search
- **Debouncing:** 300ms delay for performance
- **Search Fields:**
  - Bag Number (e.g., "B-001")
  - Student Name
- **UI Elements:**
  - Search icon on left
  - Clear button on right (appears when typing)
  - Helper text below input
- **Responsive:** Full-width on mobile, constrained on desktop

### 2. **Filter System**
**3 Active Filters:**

#### a) **Pending / Start** (Amber)
- Icon: Clock ⏱️
- Shows: Orders with `status === 'PENDING'`
- Label: "Start"
- Count badge showing number of items

#### b) **In Progress / Wash** (Blue)
- Icon: Truck 🚚
- Shows: Orders with `status === 'INPROGRESS'`
- Label: "Wash"
- Count badge showing number of items

#### c) **Complete / Done** (Green)
- Icon: CheckCircle ✅
- Shows: Orders with `status === 'COMPLETE'`
- Label: "Done"
- Count badge showing number of items

**Filter Features:**
- Click to filter by status
- Active filter highlighted with ring-2 and shadow
- Hover effect on inactive filters
- Filter resets pagination to page 1
- Filter state saved in URL parameters

---

### 3. **Orders Table**
**Component:** `OrdersTable.tsx`

#### Table Columns:
1. **Bag Number** - Identifier (e.g., B-001)
2. **Student Name** - Name of student
3. **Items** - Number/description of items
4. **Status** - Current status with icon
5. **Date** - Order creation/update date
6. **Action** - View details button

#### Status Display:
- **Pending** → "To Start" (Amber badge with Clock icon)
- **In Progress** → "Washing" (Blue badge with Truck icon)
- **Complete** → "Done" (Green badge with CheckCircle icon)

#### Row Interactions:
- Click row to view full details in modal

---

### 4. **Pagination**
**Items Per Page:** 10 orders

#### Mobile Pagination
- Shows: Previous | Page X of Y | Next
- Simple navigation with disabled states
- Shows total bags count

#### Desktop Pagination
- Shows: "Showing X-Y of Z bags" text
- Previous button
- Numbered page buttons (up to 5 visible)
- Next button
- Scroll to top on mobile when page changes

---

### 5. **Order Detail Modal**
**Component:** `OrderDetailModal.tsx`

#### Modal Content:
- **Order ID** - Bag number and ID
- **Status** - Large status display with icon
- **Student Name** - Who owns the bag
- **Date** - When order was placed
- **Description** - Order details
- **Items Count** - Number of items
- **Special Notes** - Any special instructions

#### Modal Actions:
- **Status Update Button** - Progress order to next status
  - Pending → In Progress
  - In Progress → Complete
  - Complete → Disabled
- **Close Button** - Dismiss modal

#### Status Update Logic:
```
Pending → In Progress → Complete
```

---

## 🔄 Data Flow

### 1. **Fetch Orders**
```
fetchOrders() 
  ↓
api.getAllOrders() 
  ↓
setOrders(data)
```

### 2. **Apply Filters & Search**
```
useEffect([orders, activeFilter, debouncedSearchQuery])
  ↓
Filter by status
  ↓
Filter by search query (bag number or student name)
  ↓
setFilteredOrders()
```

### 3. **Pagination**
```
filteredOrders 
  ↓
Slice by currentPage & itemsPerPage
  ↓
currentOrders passed to OrdersTable
```

---

## 🎨 UI States

### 1. **Loading State**
- Spinning loader with "Loading orders..." text
- Centered in page

### 2. **Error State**
- Red error card with message
- "Try again" button to retry

### 3. **Empty State - No Search Results**
- Search icon graphic
- Message: "No bags found"
- "Clear Search" button

### 4. **Empty State - No Orders**
- Package icon graphic
- Message: "No bags yet"
- Subtext: "No work assigned yet. Check back later!"

### 5. **Normal State**
- OrdersTable with filtered data
- Filter cards with counts
- Search bar
- Pagination controls

---

## 📱 Responsive Design

### Mobile (< 768px)
- Hide: Refresh button in header
- Hide: Desktop pagination
- Show: Mobile pagination (simple Previous/Next)
- Show: MobileHeader with title
- 3-column grid for filters
- Full-width search
- Scroll to top on page change

### Desktop (>= 768px)
- Show: Refresh button
- Show: Desktop pagination with numbered pages
- Standard header
- Auto-fit layout

---

## 🔌 API Integration

### API Calls:

1. **Get All Orders**
   ```tsx
   api.getAllOrders(): Promise<Order[]>
   ```
   - Called on mount
   - Called after status update
   - Called on refresh button click

2. **Update Order Status**
   ```tsx
   api.updateOrderStatus(orderId: number, newStatus: string)
   ```
   - Called from modal
   - Triggers order refresh

---

## 📂 Related Components

1. **DashboardLayout** - Main layout wrapper
2. **MobileHeader** - Mobile title section
3. **OrdersTable** - Table rendering
4. **OrderDetailModal** - Full order details and updates
5. **Card, Button, Input** - UI components

---

## 🚀 Summary

**The Orders page provides:**
- ✅ View all orders in a table
- ✅ Search orders by bag number or student name
- ✅ Filter orders by status (Pending, In Progress, Complete)
- ✅ Pagination (10 items per page)
- ✅ View order details in a modal
- ✅ Update order status (workflow progression)
- ✅ Refresh data manually
- ✅ Error handling and loading states
- ✅ Mobile and desktop responsive design
