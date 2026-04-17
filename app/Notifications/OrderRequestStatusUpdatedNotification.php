<?php

namespace App\Notifications;

use App\Models\OrderRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderRequestStatusUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly OrderRequest $orderRequest,
        private readonly string $statusName,
        private readonly string $statusSlug,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'order_request_status_updated',
            'order_request_id' => $this->orderRequest->id,
            'title' => 'Order request updated',
            'message' => "Your order request #{$this->orderRequest->id} is now {$this->statusName}.",
            'status' => $this->statusName,
            'status_slug' => $this->statusSlug,
            'url' => route('orders.show', $this->orderRequest),
        ];
    }
}
