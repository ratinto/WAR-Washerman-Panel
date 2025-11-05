# Orders Page - Quick Reference

## 📌 At a Glance

| Aspect | Details |
|--------|---------|
| **File** | `/src/pages/Orders.tsx` (475 lines) |
| **Default View** | All orders with PENDING status filter |
| **Landing Page** | Yes (after login) |
| **Main Purpose** | View, search, filter, and manage orders |

---

## 🎯 Main Components Used

| Component | Purpose | File |
|-----------|---------|------|
| **DashboardLayout** | Main layout wrapper | `components/DashboardLayout.tsx` |
| **MobileHeader** | Title section (mobile) | `components/MobileHeader.tsx` |
| **OrdersTable** | Renders table rows | `components/OrdersTable.tsx` |
| **OrderDetailModal** | Full order details | `components/OrderDetailModal.tsx` |
| **Card** | Filter cards + Orders card | `components/ui/card.tsx` |
| **Button** | Filter buttons, pagination | `components/ui/button.tsx` |
| **Input** | Search field | `components/ui/input.tsx` |

---

## 🔑 Key States

```typescript
orders[]                 // All orders from API
filteredOrders[]         // After filter + search
loading: boolean         // API loading state
error: string|null       // Error messages
searchQuery: string      // Current search text
debouncedSearchQuery     // Debounced search (300ms)
activeFilter             // 'pending'|'inprogress'|'complete'
selectedOrder: Order|null// Order in modal
isModalOpen: boolean     // Modal visibility
currentPage: number      // Current pagination page
```

---

## 🎨 Filters (3 Types)

### 1️⃣ Pending (Amber) - Clock Icon
- Status: `PENDING`
- Label: "Start"
- Shows: Orders waiting to be started
- Count: Total pending orders

### 2️⃣ In Progress (Blue) - Truck Icon
- Status: `INPROGRESS`
- Label: "Wash"
- Shows: Orders currently being washed
- Count: Total in-progress orders

### 3️⃣ Complete (Green) - Check Icon
- Status: `COMPLETE`
- Label: "Done"
- Shows: Orders already completed
- Count: Total completed orders

---

## 🔍 Search

- **Fields Searched:** 
  - `bagNumber` (e.g., "B-001")
  - `studentName` (e.g., "Ahmed")
  
- **Debounce:** 300ms
- **Case Insensitive:** Yes
- **Partial Match:** Yes (includes)

---

## 📄 Table Columns

1. Bag Number
2. Student Name
3. Items Count
4. Status (with icon)
5. Date (updated date)
6. View Details Button

---

## 📑 Pagination

- **Items Per Page:** 10
- **Mobile:** Previous | Page X of Y | Next
- **Desktop:** Previous | [1] [2] [3] [4] [5] | Next
- **Max Page Buttons Shown:** 5
- **Reset:** When filter/search changes

---

## 🔄 Status Flow

```
PENDING
   ↓ (Click "Progress" in modal)
INPROGRESS
   ↓ (Click "Progress" in modal)
COMPLETE
   ↓ (Can't progress further)
```

---

## 🎁 Features Summary

| Feature | Implemented | Details |
|---------|-------------|---------|
| View all orders | ✅ | Fetched from API |
| Search by text | ✅ | Debounced, 300ms |
| Filter by status | ✅ | 3 filters |
| Pagination | ✅ | 10 items/page |
| View details | ✅ | In modal |
| Update status | ✅ | 3-step workflow |
| Refresh data | ✅ | Manual button |
| Error handling | ✅ | Error messages |
| Loading state | ✅ | Spinner shown |
| Empty states | ✅ | 2 types |
| Mobile responsive | ✅ | Full support |
| URL params | ✅ | Filter saved in URL |

---

## 🚀 API Methods Used

```typescript
// Get all orders
api.getAllOrders(): Promise<Order[]>

// Update order status
api.updateOrderStatus(orderId: number, newStatus: string): Promise<void>
```

---

## 📱 Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| **Mobile < 768px** | Hide refresh button, show mobile pagination, MobileHeader visible |
| **Desktop ≥ 768px** | Show refresh button, show desktop pagination, standard header |

---

## 🎯 User Workflows

### Workflow 1: Browse Orders
```
1. Page loads
2. See Pending orders (default)
3. Scroll through pagination
4. Click row to see details
5. Close modal
```

### Workflow 2: Filter by Status
```
1. Click filter card (Start, Wash, or Done)
2. See filtered orders
3. Search within filtered results
4. Pagination resets
```

### Workflow 3: Search Orders
```
1. Click search field
2. Type bag number or student name
3. Results filter in real-time
4. Pagination updates
```

### Workflow 4: Update Order Status
```
1. Click order row
2. Modal opens
3. Click "Progress" button
4. Status updates
5. List refreshes
6. Modal closes (if auto-close) or shows success
```

---

## 🔌 API Endpoints Called

```
GET /orders/all
  → Returns: Order[]
  → Called: On mount, after status update, on refresh

PUT /orders/:id/status
  → Body: { status: 'PENDING'|'INPROGRESS'|'COMPLETE' }
  → Returns: Updated order
  → Called: When user clicks "Progress" in modal
```

---

## 🎨 Color Scheme

| Status | Background | Text | Border | Icon |
|--------|-----------|------|--------|------|
| Pending | amber-50 | amber-900 | amber-200 | ⏱️ |
| In Progress | blue-50 | blue-900 | blue-200 | 🚚 |
| Complete | green-50 | green-900 | green-200 | ✅ |
| Active | [color]-50 | white | [color]-500 | Same |

---

## 🔧 Key Event Handlers

```
handleFilterChange()    → Change active filter
handlePageChange()      → Change pagination page
handleViewDetails()     → Open modal with order
handleCloseModal()      → Close modal
handleStatusUpdate()    → Update order status
handleStatusUpdateFromCard() → Status update from table
fetchOrders()           → Fetch all orders from API
```

---

## 💾 Local Storage

None used on this page. All data from API.

---

## 🔐 Auth Required

Yes. Page is wrapped in `<ProtectedRoute>`.
Without login, user redirects to `/login`.

---

## 🔗 Navigation Links

| Link | Destination |
|------|-------------|
| Sidebar "All Bags" | `/orders` |
| Mobile Nav "Bags" | `/orders` |
| Login redirect | `/orders` |

---

## 📊 Data Flow Chart

```
API
  ↓
api.getAllOrders()
  ↓
orders[]
  ↓
┌─────────────────────────┐
│ Apply Status Filter     │
│ Apply Search Filter     │
│ (300ms debounce)        │
└─────────────────────────┘
  ↓
filteredOrders[]
  ↓
┌─────────────────────────┐
│ Calculate Pagination    │
│ (10 items/page)         │
└─────────────────────────┘
  ↓
currentOrders[]
  ↓
OrdersTable (render rows)
  ↓
User sees filtered, paginated orders
```

---

## 🎯 Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Load page | Shows pending orders |
| Click filter | Shows filtered orders |
| Type in search | Results filter (after 300ms) |
| Click page 2 | Shows next 10 items |
| Click row | Modal opens with details |
| Click "Progress" | Status updates, list refreshes |
| Clear search | Shows all (in current filter) |
| Refresh button | Re-fetches latest orders |
| Mobile view | Mobile pagination shown |
| No results | Shows "No bags found" message |

---

## ⚙️ Performance Considerations

1. **Debounce:** Search debounced to 300ms
2. **Pagination:** 10 items/page reduces DOM size
3. **Filtering:** Client-side (fast)
4. **Lazy Loading:** Not implemented
5. **Caching:** Not implemented
6. **Memoization:** Not implemented

---

## 🐛 Known Limitations

1. No auto-refresh (manual only)
2. No real-time updates
3. No bulk actions
4. No export/print
5. No order history
6. No order notes/comments
7. No photo attachments
8. No offline mode

---

## 📝 Comments in Code

- `// Commented out 'all' filter` - The 'all' filter option is commented
- `// 300ms delay` - Search debounce timing explained
- `// Reset to first page` - Pagination reset on filter change

---

## 🚨 Error Scenarios

| Error | Handling | User Sees |
|-------|----------|-----------|
| API fails | setError() | Red error card + retry button |
| Status update fails | Modal error | Error message in modal |
| No network | API timeout | "Failed to load orders" |
| No results | Empty state | "No bags found" message |

---

## ✅ Checklist for Understanding

- [x] Page purpose: Manage and view orders
- [x] Main layout: DashboardLayout wrapper
- [x] Filter system: 3 status-based filters
- [x] Search: Debounced, text-based
- [x] Pagination: 10 items per page
- [x] Modal: Shows order details
- [x] Status update: 3-step workflow
- [x] Responsive: Mobile & desktop
- [x] Error handling: Error messages & retry
- [x] API integration: GET all, PUT status

---

## 🎓 Learning Path

To understand the Orders page:

1. **First:** Read this quick reference
2. **Second:** Review the visual guide
3. **Third:** Study the detailed analysis
4. **Fourth:** Examine the code in:
   - `Orders.tsx` (main page)
   - `OrdersTable.tsx` (table component)
   - `OrderDetailModal.tsx` (modal component)
5. **Fifth:** Test the page in browser
   - Try filtering
   - Try searching
   - Try pagination
   - Try updating status
