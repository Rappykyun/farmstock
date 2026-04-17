<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Farmer Stock Movements Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
        }

        h1 {
            font-size: 18px;
            margin-bottom: 4px;
        }

        p {
            margin-top: 0;
            margin-bottom: 12px;
            color: #4b5563;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background: #f3f4f6;
        }
    </style>
</head>
<body>
    <h1>Farmer Stock Movements Report</h1>
    <p>From {{ $from }} to {{ $to }}</p>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity Change</th>
                <th>Quantity After</th>
                <th>Reason</th>
                <th>Logged By</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    <td>{{ $row['product_name'] }}</td>
                    <td>{{ $row['quantity_change'] }}</td>
                    <td>{{ $row['quantity_after'] }}</td>
                    <td>{{ $row['reason'] }}</td>
                    <td>{{ $row['logged_by'] }}</td>
                    <td>{{ $row['created_at'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6">No stock movement rows found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>