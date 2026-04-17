<?php

namespace App\Notifications;

use App\Models\OrderRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOrderRequestNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly OrderRequest $orderRequest,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_order_request',
            'order_request_id' => $this->orderRequest->id,
            'title' => 'New order request',
            'message' => "You received order request #{$this->orderRequest->id}.",
            'consumer_id' => $this->orderRequest->consumer_id,
            'total_amount' => $this->orderRequest->total_amount,
            'url' => route('farmer.orders.show', $this->orderRequest),
        ];
    }
}
