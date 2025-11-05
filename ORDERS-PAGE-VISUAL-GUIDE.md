# Orders Page - Visual Structure & Workflow

## 📐 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD LAYOUT (Sidebar)              │
├─────────────────────────────────────────────────────────────┤
│                     MOBILE HEADER                           │
│  (Title: "My Work" | Subtitle: "All clothes...")           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Header Section (Desktop Only)                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ My Work                        [🔄 Update]          │  │
│  │ All clothes to wash and clean                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Filter Cards (3 Grid)                                     │
│  ┌────────────────┬────────────────┬────────────────┐     │
│  │  ⏱️ Pending    │  🚚 In Progress │  ✅ Complete  │     │
│  │   5 Start      │   3 Wash        │   12 Done     │     │
│  └────────────────┴────────────────┴────────────────┘     │
│                                                             │
│  Search Bar                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Search bags or students...              [X]      │  │
│  │ Search by bag number (B-001) or student name         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Orders Card                                                │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📦 Pending Orders (5)        [Page 1 of 1]        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ ┌──────────────────────────────────────────────┐  │   │
│  │ │ BAG#  │ Student │ Items │ Status │ Date │ 👁️ │  │   │
│  │ ├──────────────────────────────────────────────┤  │   │
│  │ │ B-001 │ Ahmed   │   5   │ Start  │ 11:45│ → │  │   │
│  │ │ B-002 │ Fatima  │   3   │ Start  │ 11:50│ → │  │   │
│  │ │ B-003 │ Hassan  │   7   │ Start  │ 12:00│ → │  │   │
│  │ │ B-004 │ Layla   │   4   │ Start  │ 12:05│ → │  │   │
│  │ │ B-005 │ Omar    │   6   │ Start  │ 12:10│ → │  │   │
│  │ └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │  Pagination:  [← Previous]  1 of 1  [Next →]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Interaction Flow

```
Orders.tsx
├── Fetch Data
│   └── api.getAllOrders() → setOrders[]
│
├── Filter System
│   ├── Filter Cards (3 options)
│   │   ├── Pending (amber)
│   │   ├── In Progress (blue)
│   │   └── Complete (green)
│   │
│   └── Apply Filters
│       └── filteredOrders[]
│
├── Search System
│   ├── Input Field (debounced 300ms)
│   ├── Search by: bagNumber OR studentName
│   └── Apply Search → filteredOrders[]
│
├── Pagination System
│   ├── Display: 10 items per page
│   ├── Calculate: totalPages, currentPage
│   └── Render: currentOrders[]
│
├── OrdersTable Component
│   ├── Render table rows from currentOrders
│   └── onClick → handleViewDetails()
│
└── OrderDetailModal Component
    ├── Display selected order details
    ├── Show status with icon
    ├── onClick "Progress" → handleStatusUpdate()
    │   └── api.updateOrderStatus()
    │       └── fetchOrders() (refresh)
    └── onClick "Close" → handleCloseModal()
```

---

## 📊 State Dependencies

```
orders[]
  ├─ triggers: useEffect([orders, activeFilter, debouncedSearchQuery])
  │   └─ updates: filteredOrders[]
  │       ├─ used by: pagination
  │       └─ used by: OrdersTable
  │
  ├─ used by: getFilterCount()
  │   └─ displayed in: filter cards
  │
  └─ passed to: OrdersTable

activeFilter
  ├─ triggers: useEffect([orders, activeFilter, debouncedSearchQuery])
  │   └─ updates: filteredOrders[]
  │
  ├─ displayed in: highlighted filter card
  │
  └─ saved in: URL params (searchParams)

debouncedSearchQuery
  ├─ triggered by: useEffect([searchQuery]) with 300ms delay
  │
  ├─ triggers: useEffect([orders, activeFilter, debouncedSearchQuery])
  │   └─ updates: filteredOrders[]
  │
  └─ displayed in: search input placeholder

filteredOrders
  ├─ used by: pagination calculation
  │   └─ displayed in: "X of Y bags" text
  │
  ├─ sliced to: currentOrders (page items)
  │   └─ passed to: OrdersTable
  │
  └─ length used by: empty state check

currentPage
  ├─ used by: pagination calculation
  │   ├─ startIndex = (currentPage - 1) * 10
  │   └─ endIndex = startIndex + 10
  │
  └─ displayed in: pagination controls
```

---

## 🎭 Modal Workflow

```
View Order Details Flow:
─────────────────────────

User clicks on table row
  ↓
handleViewDetails(order)
  ├─ setSelectedOrder(order)
  └─ setIsModalOpen(true)
  ↓
OrderDetailModal renders with order data
  ├─ Shows: Bag#, Status, Student, Date, Notes
  ├─ Shows: Status progress button (if applicable)
  └─ Shows: Close button
  ↓
User clicks "Progress" button
  ├─ handleStatusUpdate()
  ├─ setUpdating(true)
  ├─ api.updateOrderStatus(orderId, nextStatus)
  │   └─ Pending → INPROGRESS
  │   └─ INPROGRESS → COMPLETE
  │   └─ COMPLETE → disabled
  ├─ On success:
  │   ├─ fetchOrders() (refresh list)
  │   ├─ onStatusUpdate() (close modal)
  │   └─ Shows success message
  └─ On error:
      ├─ setError(message)
      └─ Shows error message
  ↓
User clicks "Close" button
  ├─ handleCloseModal()
  ├─ setIsModalOpen(false)
  └─ setSelectedOrder(null)
```

---

## 🔍 Filter & Search Logic

```
Apply Filters & Search:
──────────────────────

1. Start with: orders[] (all orders from API)

2. Filter by Status:
   orders.filter(order => 
     order.status.toLowerCase() === activeFilter
   )
   
   Results in: [pending orders] OR [inprogress] OR [complete]

3. Filter by Search:
   filtered.filter(order =>
     order.bagNumber?.includes(query) OR
     order.studentName?.includes(query)
   )
   
   Results in: matched orders

4. Final Result: filteredOrders[]
   ↓
5. Pagination:
   slice(startIndex, endIndex) → currentOrders[]
   ↓
6. Render: OrdersTable with currentOrders[]
```

---

## 📱 Responsive Breakpoints

```
MOBILE (< 768px)
├─ Hide: Refresh button
├─ Hide: Desktop header
├─ Show: MobileHeader component
├─ Show: Mobile pagination (← Prev | Page X of Y | Next →)
├─ Filters: 3 columns (responsive grid)
├─ Search: Full width
└─ Scroll: To top on page change

DESKTOP (>= 768px)
├─ Show: Refresh button
├─ Show: Desktop header
├─ Hide: MobileHeader
├─ Show: Desktop pagination (page numbers 1-5)
├─ Filters: 3 columns (fixed)
├─ Search: Constrained width
└─ No scroll: On page change
```

---

## 🎨 Status Colors & Icons

```
Status       Icon      Color Scheme       Label       Badge Text
─────────────────────────────────────────────────────────────────
PENDING      ⏱️ Clock   Amber              "Start"     "To Start"
INPROGRESS   🚚 Truck   Blue               "Wash"      "Washing"
COMPLETE     ✅ Check   Green              "Done"      "Done"

Filter Cards:
  Active:   ring-2 ring-[color]-500, shadow-lg, bg-[color]-50
  Hover:    hover:shadow-md, hover:bg-gray-50
  Icons:    h-3.5 w-3.5 in center circle
```

---

## 🔧 Key Functions

```
fetchOrders()
  → Fetch all orders from API
  → Handle errors
  → Set loading/error states

handleFilterChange(filter)
  → Update activeFilter
  → Reset pagination to page 1
  → Save filter to URL params

handlePageChange(newPage)
  → Update currentPage
  → Scroll to top (mobile)

handleViewDetails(order)
  → Open modal with selected order

handleCloseModal()
  → Close modal
  → Clear selected order

handleStatusUpdate()
  → Call API to update status
  → Refresh orders on success
  → Handle errors

handleSearchChange(query)
  → Update searchQuery
  → Trigger debounce timer

getFilterCount(status)
  → Count orders with given status
  → Display in filter badges
```

---

## 📦 Data Structures

```
Order {
  id: number
  bagNo?: string
  bagNumber?: string
  studentName?: string
  status: 'PENDING' | 'INPROGRESS' | 'COMPLETE'
  createdAt?: string
  updatedAt: string
  items?: number
  notes?: string
}

FilterStatus = 'pending' | 'inprogress' | 'complete'

SearchParams {
  filter?: string
}
```

---

## 🚨 Error Handling

```
Try/Catch Blocks:
─────────────────

fetchOrders()
  ├─ try: api.getAllOrders()
  └─ catch: setError() → Show error card
      └─ Error can retry with "Try again" button

handleStatusUpdate()
  ├─ try: api.updateOrderStatus()
  └─ catch: setError() → Show error in modal
      └─ User can retry or close modal
```

---

## 📈 Performance Optimizations

1. **Search Debouncing:** 300ms delay
   - Prevents too many re-renders while typing
   
2. **Pagination:** 10 items per page
   - Reduces DOM elements rendered
   - Faster initial render
   
3. **URL Parameters:** Filter state saved
   - Page can be refreshed without losing filter
   - Can share filtered view URL with others

---

## 🎯 User Actions & Results

```
Action                      What Happens
──────────────────────────────────────────────────────────
Click filter card           activeFilter updated
                           filteredOrders recalculated
                           currentPage reset to 1

Type in search              searchQuery updated
                           Debounce timer starts (300ms)
                           After 300ms: filteredOrders updated

Click row                   Modal opens with order details

Click "Progress" button     Modal shows loading state
                           API call to update status
                           On success: list refreshes, modal closes
                           On error: error shown in modal

Click pagination buttons    currentPage updated
                           currentOrders sliced
                           (Mobile: scroll to top)

Click "Refresh" button      fetchOrders() called
                           spinner animates
                           Orders re-fetched from API
```

---

## 🔄 Complete User Journey

```
1. User logs in
   ↓
2. Redirected to /orders
   ↓
3. fetchOrders() runs automatically
   ↓
4. Orders displayed, default filter: PENDING
   ↓
5. User can:
   ├─ Search: Type in search box → results filter
   ├─ Filter: Click status card → orders filtered
   ├─ Paginate: Click page numbers → view next page
   ├─ View Details: Click row → modal opens
   │   └─ Update Status: Click progress → order updated
   │       └─ List refreshes automatically
   └─ Refresh: Click refresh button → data synced
```

---

## ✨ Summary

The **Orders Page** is a fully-featured order management interface with:
- Real-time search and filtering
- Status-based organization
- Pagination for performance
- Detailed order modals
- Status workflow progression
- Comprehensive error handling
- Mobile-first responsive design
- Performance optimizations
