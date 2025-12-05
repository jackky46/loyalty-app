<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Report - {{ ucfirst($type) }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #dc2626;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .summary {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .summary-grid {
            display: table;
            width: 100%;
        }
        .summary-item {
            display: table-cell;
            text-align: center;
            padding: 10px;
        }
        .summary-item .label {
            color: #666;
            font-size: 11px;
        }
        .summary-item .value {
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #dc2626;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-size: 11px;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background: #f9fafb;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mixue Loyalty Report</h1>
        <p>{{ ucfirst($type) }} Report</p>
        <p style="font-size: 11px;">Periode: {{ $startDate }} s/d {{ $endDate }}</p>
    </div>

    @if(count($summary) > 0)
    <div class="summary">
        <div class="summary-grid">
            @foreach($summary as $label => $value)
            <div class="summary-item">
                <div class="label">{{ $label }}</div>
                <div class="value">{{ $value }}</div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    @if(count($data) > 0)
    <table>
        <thead>
            <tr>
                @foreach(array_keys($data[0]) as $header)
                <th>{{ $header }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                @foreach($row as $cell)
                <td>{{ $cell }}</td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p style="text-align: center; color: #666;">Tidak ada data untuk ditampilkan</p>
    @endif

    <div class="footer">
        Generated on {{ now()->format('d/m/Y H:i') }} | Mixue Loyalty System
    </div>
</body>
</html>
