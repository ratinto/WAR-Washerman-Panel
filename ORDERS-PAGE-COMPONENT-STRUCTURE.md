# Orders Page - Component Hierarchy & File Structure

## 🏗️ Component Tree

```
Orders.tsx (Main Page)
├── DashboardLayout
│   ├── Sidebar
│   │   └── Navigation Items
│   ├── MobileNavigation (mobile only)
│   │   └── Navigation Items
│   └── Main Content Area
│       └── Orders Page Content
│           ├── MobileHeader
│           │   ├── Title: "My Work"
│           │   └── Subtitle: "All clothes to wash and clean"
│           │
│           ├── Header Section (desktop only)
│           │   ├── Title: "My Work"
│           │   ├── Subtitle
│           │   └── [🔄 Update] Button
│           │
│           ├── Filter Cards Grid (3 columns)
│           │   ├── Card: Pending (onClick → setActiveFilter)
│           │   │   ├── Icon: Clock
│           │   │   ├── Count: getFilterCount('pending')
│           │   │   └── Label: "Start"
│           │   │
│           │   ├── Card: In Progress (onClick → setActiveFilter)
│           │   │   ├── Icon: Truck
│           │   │   ├── Count: getFilterCount('inprogress')
│           │   │   └── Label: "Wash"
│           │   │
│           │   └── Card: Complete (onClick → setActiveFilter)
│           │       ├── Icon: CheckCircle
│           │       ├── Count: getFilterCount('complete')
│           │       └── Label: "Done"
│           │
│           ├── Search Bar
│           │   ├── Search Icon (left)
│           │   ├── Input Field
│           │   │   ├── onChange → setSearchQuery
│           │   │   ├── Debounce 300ms
│           │   │   └── placeholder: "Search bags or students..."
│           │   ├── Clear Button (right) [appears when typing]
│           │   └── Helper Text
│           │
│           ├── Loading State (conditional)
│           │   ├── Spinner Icon
│           │   └── "Loading orders..." text
│           │
│           ├── Error State (conditional)
│           │   ├── Error Icon (implicit)
│           │   ├── Error Message
│           │   └── [Try again] Button
│           │
│           ├── Orders Card
│           │   ├── Header
│           │   │   ├── Icon: Package2
│           │   │   ├── Title: "{Filter} Orders (count)"
│           │   │   └── Page Info: "Page X of Y"
│           │   │
│           │   └── Content
│           │       ├── Empty State (conditional)
│           │       │   ├── Search icon
│           │       │   ├── "No bags found" message
│           │       │   └── [Clear Search] Button
│           │       │
│           │       ├── Empty State (no orders)
│           │       │   ├── Package icon
│           │       │   ├── "No bags yet" message
│           │       │   └── Helper text
│           │       │
│           │       └── OrdersTable Component
│           │           ├── Table Headers
│           │           │   ├── Bag Number
│           │           │   ├── Student Name
│           │           │   ├── Items
│           │           │   ├── Status
│           │           │   ├── Date
│           │           │   └── Action
│           │           │
│           │           ├── Table Rows (per order in currentOrders)
│           │           │   ├── onClick → handleViewDetails
│           │           │   ├── Bag: B-001
│           │           │   ├── Student: Ahmed
│           │           │   ├── Items: 5
│           │           │   ├── Status: [Badge with icon]
│           │           │   ├── Date: 11:45
│           │           │   └── [View] Button → onclick event
│           │           │
│           │           └── Table Footer
│           │               └── (Pagination controls below)
│           │
│           ├── Pagination (mobile - conditional)
│           │   ├── [← Previous] Button
│           │   ├── "Page X of Y"
│           │   ├── "Z bags total"
│           │   └── [Next →] Button
│           │
│           └── Pagination (desktop - conditional)
│               ├── "Showing X-Y of Z bags" text
│               ├── [← Previous] Button
│               ├── [1] [2] [3] [4] [5] Buttons (smart)
│               └── [Next →] Button
│
└── OrderDetailModal
    ├── Dialog Overlay
    ├── Dialog Header
    │   └── "Order Details"
    │
    ├── Dialog Content
    │   ├── Status Section
    │   │   ├── Large Status Icon
    │   │   ├── Status Label (formatted)
    │   │   └── Status Badge
    │   │
    │   ├── Details Section
    │   │   ├── Bag Number: B-001
    │   │   ├── Student: Ahmed
    │   │   ├── Date: Nov 5, 2025
    │   │   ├── Items: 5
    │   │   ├── Description: ...
    │   │   └── Notes: ...
    │   │
    │   └── Actions Section
    │       └── [Progress →] Button (if canProgressStatus)
    │           └── onClick → handleStatusUpdate
    │
    └── Dialog Footer
        └── [Close] Button → handleCloseModal
```

---

## 📂 File Hierarchy

```
WAR-Washerman-Panel/
├── src/
│   ├── pages/
│   │   └── Orders.tsx ⭐ (Main page - 475 lines)
│   │
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   ├── MobileHeader.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── OrdersTable.tsx ⭐ (Renders table rows)
│   │   ├── OrderDetailModal.tsx ⭐ (Order details & status update)
│   │   ├── OrderStatusChart.tsx (Not used on this page)
│   │   ├── Sidebar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       ├── separator.tsx
│   │       └── tabs.tsx
│   │
│   ├── services/
│   │   └── api.ts (API calls)
│   │
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx (Auth state)
│   │
│   └── lib/
│       └── utils.ts (Utility functions)
│
└── public/
    └── vite.svg
```

---

## 🔄 Data Flow Between Components

```
Orders.tsx (Page)
    ↓
    ├─── fetchOrders() ──→ api.getAllOrders() ──→ setOrders[]
    │
    ├─── Filter Logic
    │    └─ Filter Cards (3x Card UI)
    │       ├─ Pending Card: onClick → handleFilterChange('pending')
    │       ├─ In Progress Card: onClick → handleFilterChange('inprogress')
    │       └─ Complete Card: onClick → handleFilterChange('complete')
    │
    ├─── Search Logic
    │    └─ Search Input (Input UI)
    │       ├─ onChange → setSearchQuery
    │       ├─ Debounce 300ms → setDebouncedSearchQuery
    │       └─ Clear Button: onClick → setSearchQuery('')
    │
    ├─── useEffect: Apply Filters
    │    └─ [orders, activeFilter, debouncedSearchQuery]
    │       ├─ Filter by status
    │       ├─ Filter by search term
    │       └─ setFilteredOrders()
    │
    ├─── Pagination Logic
    │    ├─ Calculate: totalPages, startIndex, endIndex
    │    ├─ Slice: filteredOrders → currentOrders[]
    │    └─ Pagination Controls (Button UI)
    │       └─ onClick → handlePageChange()
    │
    ├─── OrdersTable Component
    │    ├─ Props: orders={currentOrders}
    │    ├─ Props: onViewDetails={handleViewDetails}
    │    ├─ Props: onStatusUpdate={handleStatusUpdateFromCard}
    │    └─ Events:
    │       └─ Row onClick → handleViewDetails(order)
    │           └─ setSelectedOrder(order)
    │           └─ setIsModalOpen(true)
    │
    └─── OrderDetailModal Component
         ├─ Props: order={selectedOrder}
         ├─ Props: isOpen={isModalOpen}
         ├─ Props: onClose={handleCloseModal}
         ├─ Props: onStatusUpdate={handleStatusUpdate}
         └─ Events:
            ├─ Close Button: onClick → handleCloseModal()
            └─ Progress Button: onClick → handleStatusUpdate()
               └─ api.updateOrderStatus()
                  └─ fetchOrders() [refresh list]
                  └─ onStatusUpdate() [callback]
```

---

## 🎯 Component Responsibilities

| Component | Responsibility |
|-----------|-----------------|
| **Orders.tsx** | Main page logic, state management, data fetching, filtering, pagination |
| **OrdersTable.tsx** | Render table rows, display order data in table format |
| **OrderDetailModal.tsx** | Display full order details, handle status updates |
| **DashboardLayout.tsx** | Page layout wrapper, sidebar, mobile nav |
| **MobileHeader.tsx** | Mobile page title and subtitle |
| **Card** (UI) | Filter cards, Orders card container |
| **Button** (UI) | Filter buttons, pagination buttons, action buttons |
| **Input** (UI) | Search field input |
| **Dialog** (UI) | Modal container and structure |

---

## 🔌 Props Passed Down

### OrdersTable Props
```typescript
interface OrdersTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onStatusUpdate?: (orderId: number, newStatus: string) => void;
}
```

### OrderDetailModal Props
```typescript
interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}
```

---

## 🎨 Styling Approach

- **Framework:** Tailwind CSS
- **Classes:** Utility classes throughout
- **Theme Colors:** 
  - `text-maroon` (primary)
  - `brand-primary` (branded color)
  - Status colors: amber, blue, green
- **Components:** shadcn/ui components
- **Responsive:** Tailwind breakpoints (md: 768px)

---

## 🔐 Component Access Control

```
Public Routes:
  /login (Login.tsx)

Protected Routes:
  /orders ← OrdersTable component needs ProtectedRoute
  /students
  /settings
  /statistics (commented)
```

---

## 📊 Component Size Reference

| Component | File Size | Complexity |
|-----------|-----------|------------|
| Orders.tsx | 475 lines | High |
| OrdersTable.tsx | ~155 lines | Medium |
| OrderDetailModal.tsx | ~229 lines | Medium |
| DashboardLayout.tsx | - | Medium |
| MobileHeader.tsx | - | Low |

---

## 🔗 Internal Dependencies

```
Orders.tsx
  ├─ imports: DashboardLayout
  ├─ imports: MobileHeader
  ├─ imports: OrdersTable
  ├─ imports: OrderDetailModal
  ├─ imports: Card, CardContent, CardHeader, CardTitle
  ├─ imports: Button
  ├─ imports: Input
  ├─ imports: api service
  ├─ imports: AuthContext
  ├─ imports: types (Order, DashboardStats)
  └─ imports: icons (lucide-react)

OrdersTable.tsx
  ├─ imports: Order type
  ├─ imports: format (date-fns)
  ├─ imports: Button
  └─ imports: icons

OrderDetailModal.tsx
  ├─ imports: Dialog UI components
  ├─ imports: Button
  ├─ imports: Order type
  ├─ imports: api service
  └─ imports: icons
```

---

## 🚀 External Dependencies

```
Libraries Used:
  ├─ React & React Router
  ├─ Tailwind CSS
  ├─ shadcn/ui components
  ├─ lucide-react (icons)
  ├─ date-fns (date formatting)
  └─ axios (HTTP client via api service)
```

---

## 🎭 State Management Summary

```
Local Component State (Orders.tsx):
├─ orders[] - API data
├─ filteredOrders[] - After filtering
├─ loading: boolean
├─ error: string|null
├─ searchQuery: string
├─ debouncedSearchQuery: string
├─ activeFilter: FilterStatus
├─ selectedOrder: Order|null
├─ isModalOpen: boolean
├─ currentPage: number
└─ itemsPerPage: number (constant)

Context State (AuthContext):
├─ user: User
└─ logout: () => void
```

---

## 🔄 Re-render Triggers

```
Orders component re-renders when:
  ├─ Component mounts
  ├─ searchQuery changes
  ├─ activeFilter changes
  ├─ currentPage changes
  ├─ orders[] changes (API response)
  ├─ isModalOpen changes
  ├─ selectedOrder changes
  └─ loading or error state changes

Children re-render when:
  ├─ OrdersTable: currentOrders[] changes
  ├─ OrderDetailModal: selectedOrder or isModalOpen changes
  └─ Filter Cards: getFilterCount() results change
```

---

## 📱 Responsive Component Behavior

```
Mobile (< 768px):
├─ DashboardLayout: 1 column (no sidebar visible)
├─ MobileHeader: Shown
├─ Desktop header: Hidden
├─ MobileNavigation: Shown at bottom
├─ Pagination: Mobile version (simple)
└─ Cards: Stack nicely

Desktop (>= 768px):
├─ DashboardLayout: 2 columns (sidebar + content)
├─ MobileHeader: Hidden
├─ Desktop header: Shown
├─ MobileNavigation: Hidden
├─ Pagination: Desktop version (numbered)
└─ Cards: Flex row layout
```

---

## ✨ Component Lifecycle

```
Mount:
  1. Orders.tsx mounts
  2. useEffect runs: fetchOrders()
  3. API call: getAllOrders()
  4. Response: setOrders()
  5. Render: Orders displayed

User Filters:
  1. User clicks filter card
  2. handleFilterChange() runs
  3. activeFilter updates
  4. useEffect triggers (filter dependency)
  5. applyFilters() runs
  6. setFilteredOrders() updates
  7. Re-render: Filtered orders shown

User Searches:
  1. User types in search
  2. setSearchQuery() runs
  3. Debounce timer starts (300ms)
  4. After 300ms: setDebouncedSearchQuery()
  5. useEffect triggers (search dependency)
  6. applyFilters() runs
  7. setFilteredOrders() updates
  8. Re-render: Search results shown

User Clicks Order:
  1. User clicks table row
  2. handleViewDetails() runs
  3. setSelectedOrder(order)
  4. setIsModalOpen(true)
  5. OrderDetailModal renders with data

User Updates Status:
  1. User clicks "Progress" in modal
  2. handleStatusUpdate() runs
  3. API call: updateOrderStatus()
  4. Response: Success/Error
  5. fetchOrders() runs (refresh)
  6. Re-render: Updated orders shown
  7. Modal closes or shows success
```

---

## 🎯 This is Your Orders Page!

Now you understand:
- ✅ Component structure and hierarchy
- ✅ How data flows through components
- ✅ What each component does
- ✅ How state is managed
- ✅ How user interactions trigger updates
- ✅ How responsive design works
- ✅ API integration patterns
- ✅ Error handling approach
