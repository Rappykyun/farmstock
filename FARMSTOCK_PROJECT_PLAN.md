---
name: Farmstock Project Plan
overview: A phased, feature-by-feature implementation plan for the Farmstock digital inventory platform -- a web-based system for farmers in Lebak, Sultan Kudarat to manage products and inventory, and for local consumers to browse and submit order requests.
todos:
  - id: p0-fix-db-config
    content: 0.1 Fix DB config drift -- align .env.docker.example and DOCKER.md to MySQL 8.4 (match docker-compose.yml)
    status: pending
  - id: p0-install-spatie
    content: 0.2 Install Spatie Laravel Permission -- composer require, publish migration, run migrate
    status: pending
  - id: p0-seed-roles
    content: 0.3 Seed roles and admin user -- create admin/farmer/consumer roles in DatabaseSeeder, seed a test admin account
    status: pending
  - id: p0-extend-user-model
    content: 0.4a Extend User model -- add migration for address, contact_number, farm_name, farm_details, avatar columns; update fillable/casts
    status: pending
  - id: p0-update-registration
    content: 0.4b Update registration flow -- modify CreateNewUser action to accept role + farm fields; update React register page with role picker and conditional farm inputs
    status: pending
  - id: p0-role-middleware
    content: 0.5a Create role-based middleware -- EnsureUserHasRole middleware that checks Spatie roles
    status: pending
  - id: p0-dashboard-routing
    content: 0.5b Dashboard routing -- create /admin/dashboard, /farmer/dashboard, /dashboard (consumer) routes with role middleware; redirect after login based on role
    status: pending
  - id: p0-admin-layout
    content: 0.5c Admin layout shell -- create sidebar navigation layout for admin pages (reusable across Phase 1)
    status: pending
  - id: p0-farmer-layout
    content: 0.5d Farmer layout shell -- create sidebar navigation layout for farmer pages (reusable across Phase 2)
    status: pending
  - id: p1-categories-migration
    content: 1.1a Product Categories -- create migration and ProductCategory model with relationships
    status: pending
  - id: p1-categories-backend
    content: 1.1b Product Categories -- create Admin\ProductCategoryController with index/store/update/destroy; add routes
    status: pending
  - id: p1-categories-frontend
    content: "1.1c Product Categories -- build React pages: data table (index), create/edit form modal"
    status: pending
  - id: p1-units-migration
    content: 1.2a Units of Measure -- create migration and Unit model
    status: pending
  - id: p1-units-backend
    content: 1.2b Units of Measure -- create Admin\UnitController with CRUD; add routes
    status: pending
  - id: p1-units-frontend
    content: "1.2c Units of Measure -- build React pages: data table, create/edit form modal"
    status: pending
  - id: p1-statuses-migration
    content: "1.3a Status Definitions -- create migration and Status model (type enum: product/inventory/order)"
    status: pending
  - id: p1-statuses-backend
    content: 1.3b Status Definitions -- create Admin\StatusController with CRUD; add routes
    status: pending
  - id: p1-statuses-frontend
    content: "1.3c Status Definitions -- build React pages: data table with type filter, create/edit form with color picker"
    status: pending
  - id: p1-users-backend
    content: "1.4a User Account Management -- create Admin\\UserController: list users with role/status filters, approve/deactivate, assign roles"
    status: pending
  - id: p1-users-frontend
    content: "1.4b User Account Management -- build React pages: users data table with filters, edit/role-assign modal, activate/deactivate toggle"
    status: pending
  - id: p1-admin-dashboard
    content: 1.5 Admin Dashboard -- summary cards (user counts by role, total products, pending orders), recent activity list, orders-over-time chart (Recharts)
    status: pending
  - id: p2-products-migration
    content: 2.1a Product Registration -- create products migration (farmer_id, category_id, unit_id, name, description, price, status_id, is_active, soft deletes) and Product model with relationships
    status: pending
  - id: p2-products-policy
    content: "2.1b Product Policy -- create ProductPolicy: only owning farmer can update/delete; admin can view all"
    status: pending
  - id: p2-products-backend
    content: 2.1c Product Registration -- create Farmer\ProductController with index/create/store/edit/update/destroy; add routes under farmer middleware
    status: pending
  - id: p2-products-frontend
    content: "2.1d Product Registration -- build React pages: product data table (search, category filter), create/edit form (dropdowns for category/unit/status), product detail view"
    status: pending
  - id: p2-images-migration
    content: 2.2a Product Images -- create product_images migration (product_id, path, is_primary, sort_order) and ProductImage model
    status: pending
  - id: p2-images-backend
    content: 2.2b Product Images -- file upload endpoint with validation (JPG/JPEG/PNG, max size), thumbnail generation, delete endpoint; configure products filesystem disk
    status: pending
  - id: p2-images-frontend
    content: 2.2c Product Images -- drag-and-drop image uploader component, image gallery on product form, reorder and set-primary controls
    status: pending
  - id: p2-inventory-migration
    content: 2.3a Inventory Management -- create inventory_logs migration (product_id, quantity_change, quantity_after, reason, logged_by); add current_stock column to products
    status: pending
  - id: p2-inventory-backend
    content: "2.3b Inventory Management -- create Farmer\\InventoryController: update stock (add/subtract with reason), view history per product; auto-create log entry on every change"
    status: pending
  - id: p2-inventory-frontend
    content: 2.3c Inventory Management -- stock overview grid (product name, current stock, last updated), stock update modal (quantity +/-, reason), history timeline per product
    status: pending
  - id: p2-farmer-dashboard
    content: 2.4 Farmer Dashboard -- my products count card, low-stock alerts list, incoming orders count, recent inventory changes timeline, quick-action buttons (Add Product, Update Stock)
    status: pending
  - id: p3-browse-backend
    content: "3.1a Product Browsing -- create Consumer\\ProductBrowseController: paginated product listing with category/search/sort filters, single product detail"
    status: pending
  - id: p3-browse-frontend
    content: 3.1b Product Browsing -- card grid layout with category sidebar, search bar, sort dropdown (price/date), product detail page with image gallery, farmer info, stock badge
    status: pending
  - id: p3-orders-migration
    content: 3.2a Order Requests -- create order_requests migration (consumer_id, farmer_id, status_id, notes, total_amount) and order_request_items migration (order_request_id, product_id, quantity, unit_price, subtotal); create models with relationships
    status: pending
  - id: p3-orders-consumer-backend
    content: "3.2b Order Request Submission -- create Consumer\\OrderRequestController: create order from product detail, list own requests with status; OrderRequestPolicy (own requests only)"
    status: pending
  - id: p3-orders-consumer-frontend
    content: 3.2c Order Request Submission -- order form (quantity, notes), my requests list page with status badges and detail view
    status: pending
  - id: p3-orders-farmer-backend
    content: "3.3a Order Handling (Farmer) -- create Farmer\\OrderRequestController: list incoming requests, accept/reject/complete actions; auto-decrement stock on accept; status transitions (Pending -> Accepted -> Completed / Rejected)"
    status: pending
  - id: p3-orders-farmer-frontend
    content: 3.3b Order Handling (Farmer) -- incoming requests list page, request detail with item breakdown, accept/reject action buttons with confirmation
    status: pending
  - id: p3-consumer-dashboard
    content: 3.4 Consumer Dashboard -- recent order requests with status badges, quick-browse section with featured/recently-listed products
    status: pending
  - id: p4-activity-log-setup
    content: "4.1a Activity Logging -- install spatie/laravel-activitylog (or create custom: migration for activity_logs table, ActivityLog model, LogsActivity trait)"
    status: pending
  - id: p4-activity-log-integration
    content: 4.1b Activity Logging -- attach LogsActivity trait to Product, OrderRequest, User models; log create/update/delete events with user, IP, and changed properties
    status: pending
  - id: p4-reports-admin
    content: 4.2a Admin Reports -- user statistics, inventory summaries across all farmers, order request volume over time; filter by date range; export to CSV
    status: pending
  - id: p4-reports-farmer
    content: 4.2b Farmer Reports -- my inventory summary, order history, stock movement report; filter by date range and product; export to CSV/PDF (barryvdh/laravel-dompdf)
    status: pending
  - id: p4-reports-frontend
    content: 4.2c Reports Frontend -- reports page with role-scoped tabs, date range picker, data tables, export buttons
    status: pending
  - id: p4-admin-activity-monitor
    content: 4.3 Admin Activity Monitor -- activity log stream page with filters (user, action type, date range), linked from admin dashboard summary cards
    status: pending
  - id: p5-notifications-backend
    content: "5.1a Notifications Backend -- create Laravel notifications: NewOrderRequestNotification (to farmer), OrderStatusChangedNotification (to consumer); database + mail channels; create notifications migration"
    status: pending
  - id: p5-notifications-frontend
    content: 5.1b Notifications Frontend -- notification bell in nav bar, dropdown with unread notifications, mark-as-read, notifications index page
    status: pending
  - id: p5-security
    content: 5.2 Security Hardening -- enable MustVerifyEmail on User, rate limiting on order submissions and login, file upload validation rules, sanitize all text inputs
    status: pending
  - id: p5-system-settings
    content: 5.3 System Settings (Admin) -- create settings migration (key-value table), Settings model, Admin\SettingsController; admin settings page for toggles (registration open/closed, max upload size, order limits)
    status: pending
  - id: p5-landing-page
    content: "5.4 Landing Page -- replace starter welcome page with marketing landing page: hero section, features overview, public product catalog preview, register CTA"
    status: pending
  - id: p5-testing
    content: "5.5 Testing -- Pest feature tests: role-based registration, product CRUD as farmer, inventory update flow, order lifecycle (submit -> accept -> complete), admin user management, unauthorized access blocked"
    status: pending
isProject: false
---

# Farmstock: Digital Inventory Platform -- Implementation Plan

## Current State

The codebase is a **Laravel 13 + Inertia/React + Fortify** starter. What exists today:

- Auth scaffolding (login, register, forgot password, 2FA, email verification)
- A single `User` model with no domain fields
- A blank dashboard page at `/dashboard`
- Settings pages (profile, security, appearance)
- Docker + MySQL compose stack, GitHub Actions deploy pipeline

**Nothing domain-specific exists yet.** All farm/inventory/consumer/order logic needs to be built from scratch.

---

## Architecture Overview

```mermaid
graph TB
    subgraph frontend ["Frontend (React/Inertia)"]
        AdminDash["Admin Dashboard"]
        FarmerDash["Farmer Dashboard"]
        ConsumerDash["Consumer Dashboard"]
        ProductBrowse["Product Browser"]
        OrderFlow["Order Request Flow"]
    end

    subgraph backend ["Backend (Laravel 13)"]
        AuthLayer["Auth + Roles (Fortify + Spatie)"]
        ProductModule["Product + Inventory Module"]
        OrderModule["Order Request Module"]
        ReportModule["Reports + Activity Logs"]
        FileModule["File Upload (Images/Docs)"]
    end

    subgraph data ["Database (MySQL 8.4)"]
        Users["users"]
        Products["products"]
        Categories["product_categories"]
        Inventory["inventory_logs"]
        Orders["order_requests"]
        ActivityLogs["activity_logs"]
    end

    frontend --> backend
    backend --> data
```

---

## Phase 0: Foundation and Housekeeping

Before building features, fix the infrastructure inconsistencies and lay the groundwork.

### 0.1 -- Fix DB config drift

The `docker-compose.yml` uses MySQL but `.env.docker.example` and docs reference PostgreSQL. Align everything to **MySQL 8.4** (which is what compose already uses). Update `.env.docker.example` to use `DB_CONNECTION=mysql` and port `3306`.

### 0.2 -- Install role/permission package

Install **Spatie Laravel Permission** (`spatie/laravel-permission`). This gives you a battle-tested roles and permissions system. Define three roles: `admin`, `farmer`, `consumer`.

### 0.3 -- Add `role` seeding to `DatabaseSeeder`

Seed the three roles and create one admin user for development.

### 0.4 -- Extend User model + registration

- Add domain fields to `users` migration: `address`, `contact_number`, `farm_name` (nullable, farmer-only), `farm_details` (nullable), `avatar` (nullable).
- Update the Fortify `CreateNewUser` action to accept a `role` field during registration (defaulting to `consumer`; `admin` only assignable by another admin).
- Update the registration React page to include role selection (Farmer vs Consumer) and conditional farm fields.

### 0.5 -- Build role-based middleware and dashboard routing

Create middleware that redirects users to their role-specific dashboard after login:

- `/admin/dashboard`
- `/farmer/dashboard`
- `/dashboard` (consumer)

**Key files touched:** [routes/web.php](routes/web.php), [app/Models/User.php](app/Models/User.php), [app/Actions/Fortify/CreateNewUser.php](app/Actions/Fortify/CreateNewUser.php), new migration, [database/seeders/DatabaseSeeder.php](database/seeders/DatabaseSeeder.php)

---

## Phase 1: Admin -- System Reference Data

The admin panel is the backbone. Build it first so you can manage categories, units, and statuses that the farmer module depends on.

### 1.1 -- Product Categories (CRUD)

- **Migration:** `product_categories` table (`id`, `name`, `description`, `is_active`, timestamps)
- **Model:** `ProductCategory`
- **Controller:** `Admin\ProductCategoryController`
- **Pages:** `resources/js/pages/admin/categories/` -- index (data table), create/edit (form)

### 1.2 -- Units of Measure (CRUD)

- **Migration:** `units` table (`id`, `name`, `abbreviation`, `is_active`, timestamps)
- **Model:** `Unit`
- **Controller:** `Admin\UnitController`
- **Pages:** `resources/js/pages/admin/units/`

### 1.3 -- Status Definitions (CRUD)

- **Migration:** `statuses` table (`id`, `name`, `type` enum: product/inventory/order, `color`, `is_default`, timestamps)
- **Model:** `Status`
- **Controller:** `Admin\StatusController`
- **Pages:** `resources/js/pages/admin/statuses/`

### 1.4 -- User Account Management

- **Controller:** `Admin\UserController` -- list all users, approve/deactivate accounts, assign/remove roles
- **Pages:** `resources/js/pages/admin/users/` -- index with filters (role, status), edit modal
- Uses Spatie permission package to manage roles

### 1.5 -- Admin Dashboard

- Summary cards: total users (by role), total products, pending order requests, recent activity
- Chart: orders over time (use a lightweight chart lib like Recharts, already compatible with the React stack)

---

## Phase 2: Farmer -- Products and Inventory

### 2.1 -- Product Registration

- **Migration:** `products` table (`id`, `farmer_id` FK, `category_id` FK, `name`, `description`, `unit_id` FK, `price`, `status_id` FK, `is_active`, timestamps, soft deletes)
- **Model:** `Product` with relationships to User (farmer), ProductCategory, Unit, Status
- **Controller:** `Farmer\ProductController`
- **Pages:** `resources/js/pages/farmer/products/` -- index (data table with search/filter), create, edit, show
- **Policy:** `ProductPolicy` -- only the owning farmer can edit/delete

### 2.2 -- Product Image Upload

- **Migration:** `product_images` table (`id`, `product_id` FK, `path`, `is_primary`, `sort_order`, timestamps)
- **Model:** `ProductImage`
- Use Laravel's filesystem with a `products` disk (local or S3-compatible)
- Accept JPG, JPEG, PNG; validate size; generate thumbnails
- React: drag-and-drop image uploader component, reorder, set primary

### 2.3 -- Inventory Management

- **Migration:** `inventory_logs` table (`id`, `product_id` FK, `quantity_change`, `quantity_after`, `reason`, `logged_by` FK, timestamps)
- Add `current_stock` column to `products` table (denormalized for fast reads)
- **Controller:** `Farmer\InventoryController` -- update stock (add/subtract), view history
- **Pages:** `resources/js/pages/farmer/inventory/` -- stock overview grid, update modal, history timeline
- Every stock change creates an `inventory_log` entry for auditability

### 2.4 -- Farmer Dashboard

- My products count, low-stock alerts, incoming order requests count
- Recent inventory changes timeline
- Quick-action buttons: "Add Product", "Update Stock"

---

## Phase 3: Consumer -- Browse and Order

### 3.1 -- Product Browsing (Public/Auth)

- **Controller:** `Consumer\ProductBrowseController`
- **Pages:** `resources/js/pages/products/` -- index (card grid with category filter, search, sort by price/date), show (product detail with images, farmer info, stock availability)
- Accessible to authenticated consumers (and optionally as a public catalog on the landing page)

### 3.2 -- Order Request Submission

- **Migration:** `order_requests` table (`id`, `consumer_id` FK, `farmer_id` FK, `status_id` FK, `notes`, `total_amount`, timestamps)
- **Migration:** `order_request_items` table (`id`, `order_request_id` FK, `product_id` FK, `quantity`, `unit_price`, `subtotal`, timestamps)
- **Model:** `OrderRequest`, `OrderRequestItem`
- **Controller:** `Consumer\OrderRequestController` -- create, view own requests
- **Pages:** order form (from product detail or cart-like flow), my requests list with status badges
- **Policy:** consumers can only view their own requests

### 3.3 -- Order Request Handling (Farmer side)

- **Controller:** `Farmer\OrderRequestController` -- view incoming requests, accept/reject/mark as completed
- **Pages:** `resources/js/pages/farmer/orders/` -- incoming requests list, detail view with accept/reject actions
- When a farmer accepts, stock is decremented and an inventory log is created
- Status transitions: Pending -> Accepted -> Completed / Rejected

### 3.4 -- Consumer Dashboard

- My recent order requests with statuses
- Quick-browse section showing recently listed or featured products

---

## Phase 4: Reporting and Activity Logs

### 4.1 -- Activity Logging

- **Migration:** `activity_logs` table (`id`, `user_id` FK, `action`, `model_type`, `model_id`, `description`, `ip_address`, `properties` JSON, timestamps)
- **Model:** `ActivityLog`
- Use a trait `LogsActivity` on key models (Product, OrderRequest, User) that auto-logs create/update/delete events
- Or integrate the `spatie/laravel-activitylog` package for a mature solution

### 4.2 -- Report Generation

- **Admin reports:** user statistics, inventory summaries across all farmers, order request volume, system activity
- **Farmer reports:** my product inventory summary, order history, stock movement report
- **Controller:** `ReportController` (scoped by role)
- **Pages:** `resources/js/pages/reports/` -- filter by date range, export to CSV/PDF
- For PDF export, use `barryvdh/laravel-dompdf`

### 4.3 -- Admin Activity Monitor

- Admin page showing the activity log stream with filters (user, action type, date range)
- Link from dashboard summary cards to filtered log views

---

## Phase 5: Polish and Evaluation-Ready

### 5.1 -- Notification system

- Notify farmers when they receive a new order request (database + optional email)
- Notify consumers when their order request status changes
- Use Laravel's built-in notification system with a database channel
- React: notification bell in the nav bar

### 5.2 -- Security hardening

- Enable email verification (uncomment `MustVerifyEmail` on User model)
- Rate limiting on order submissions
- CSRF already handled by Inertia
- Input sanitization and file upload validation

### 5.3 -- System settings (Admin)

- A key-value `settings` table for toggleable system behavior: enable/disable registration, max upload size, order request limits, etc.
- Admin settings page

### 5.4 -- Landing page

- Replace the starter `welcome` page with a proper marketing/landing page showcasing the platform, its features, and a call to register
- Show a public product catalog preview

### 5.5 -- Testing

- Feature tests for each major flow (registration by role, product CRUD, inventory updates, order lifecycle)
- Build on the existing Pest test setup in [tests/](tests/)

---

## Suggested Build Order (Summary)

| Order   | What                                     | Why                                                |
| ------- | ---------------------------------------- | -------------------------------------------------- |
| Phase 0 | Foundation (roles, user fields, routing) | Everything depends on roles                        |
| Phase 1 | Admin reference data + user management   | Farmers need categories/units to register products |
| Phase 2 | Farmer products + inventory              | Core domain -- the system's reason to exist        |
| Phase 3 | Consumer browsing + order requests       | Depends on products existing                       |
| Phase 4 | Reports + activity logs                  | Needs data from phases 1-3                         |
| Phase 5 | Polish, notifications, landing page      | Final layer before evaluation                      |

Each phase is independently demonstrable -- you can show progress to your adviser after each one.
