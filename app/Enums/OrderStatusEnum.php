<?php

namespace App\Enums;

enum OrderStatusEnum: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';
}