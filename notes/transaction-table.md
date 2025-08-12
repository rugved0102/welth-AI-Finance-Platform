
# 📄 TransactionTable Component – Notes

## 📌 Overview

`TransactionTable` is a **React client component** (Next.js 13+ “use client” syntax) that displays a paginated, filterable, sortable, and selectable table of transactions, with the ability to delete single or multiple transactions.

***

## 🔹 Key Features

### 1. **Data Processing**

- **Filtering**:
    - Search by text in transaction description.
    - Filter by `type` (INCOME / EXPENSE).
    - Filter by recurring status (Recurring / Non-recurring).
- **Sorting**:
    - Sort by **date**, **amount**, or **category** in ascending/descending order.
- **Pagination** *(Client-side)*:
    - 10 items per page definition: `ITEMS_PER_PAGE = 10`.
    - Calculates total pages from filtered results.
    - Slices the filtered/sorted transactions for the current page.

***

### 2. **Selection \& Bulk Actions**

- Ability to **select individual transactions** via checkboxes.
- "Select All" checkbox checks/unchecks all transactions **on the current page**.
- **Bulk Delete**:
    - Confirms action with `window.confirm`.
    - Uses `bulkDeleteTransactions()` via a `useFetch` hook.
    - Clears selections after deletion.

***

### 3. **Delete Single Transaction**

- Each row’s dropdown menu contains:
    - **Edit** → Navigates to `transaction/create?edit={id}`.
    - **Delete** → Deletes that transaction immediately.

***

### 4. **UI Components Used**

- **ShadCN UI**: Table, Buttons, Inputs, Select menus, Checkbox, Badge, Dropdown, Tooltip.
- **Lucide Icons**: Chevron for sorting/pagination, Trash icon for delete, etc.
- **BarLoader** (react-spinners): Shows when delete request is loading.
- **Toast** (`sonner`): Displays a success message after deletion.

***

### 5. **State Variables**

| State | Purpose |
| :-- | :-- |
| `selectedIds` | Array of transaction IDs currently selected. |
| `sortConfig` | Object for sorting `{ field, direction }`. |
| `searchTerm` | Search string for filtering descriptions. |
| `typeFilter` | Filter for INCOME / EXPENSE. |
| `recurringFilter` | Filter for recurring status. |
| `currentPage` | Tracks which page user is on. |


***

### 6. **Important useEffects**

- **After Deletion**: Shows toast and clears selection.

```js
useEffect(() => {
  if (deleted && !deleteLoading) {
    toast.error("Transactions deleted successfully");
    setSelectedIds([]);
  }
}, [deleted, deleteLoading]);
```


***

### 7. **Pagination Logic Recap**

```js
const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
const paginatedTransactions = filteredAndSortedTransactions.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
```

- Data is **filtered → sorted → sliced** in that order.
- Page change also clears selection.

***

### 8. **Recurring Badges**

- Recurring transactions get a purple badge showing the interval (Daily, Weekly, Monthly, Yearly) + tooltip with **Next Date**.
- Non-recurring gets a grey "One-time" badge.

***

## 🖼️ Example Flow

1. User selects filters and/or search → list updates.
2. User clicks column headers → list is re-sorted.
3. User navigates pages using arrows → only 10 items shown at once.
4. User selects transactions → bulk delete button appears.
5. Deleting a transaction clears the selection and shows a toast.

***

## 📂 Where This Fits

This component is part of a **Next.js financial tracker app** where users can manage their income/expenses history.

***

If you want, I can also make a **diagram** showing the flow: _transactions → filter → sort → paginate → table display_, so you visually remember the data processing order.
Do you want me to add that diagram to the README?

