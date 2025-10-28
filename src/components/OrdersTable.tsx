import type { Order } from '@/types';
import { format } from 'date-fns';
import { Clock, Truck, CheckCircle, Package2, User, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface OrdersTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onStatusUpdate?: (orderId: number, newStatus: string) => void;
}

export function OrdersTable({ orders, onViewDetails, onStatusUpdate }: OrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'inprogress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'complete':
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'inprogress':
      case 'in progress':
        return <Truck className="h-4 w-4" />;
      case 'complete':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package2 className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: string) => {
    if (status.toLowerCase() === 'inprogress') {
      return 'Washing';
    }
    if (status.toLowerCase() === 'complete') {
      return 'Done';
    }
    if (status.toLowerCase() === 'pending') {
      return 'To Start';
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          onClick={() => onViewDetails?.(order)}
        >
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Bag: {order.bagNo}
                </h3>
                <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                  <User className="h-3 w-3" />
                  {order.studentName || 'Student'}
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {formatStatus(order.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 md:gap-3 bg-muted/50 rounded-lg p-2 md:p-3">
            <div className="flex flex-col items-center text-center">
              <Package2 className="h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Clothes</p>
              <p className="text-lg md:text-xl font-semibold">
                {order.numberOfClothes || order.noOfClothes || 0}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="text-xs md:text-sm font-medium">
                {order.submissionDate 
                  ? format(new Date(order.submissionDate), 'MMM dd')
                  : 'Today'
                }
              </p>
            </div>
          </div>
          
          {/* Action Button based on status */}
          <div className="mt-2 md:mt-3 flex justify-center">
            {order.status.toLowerCase() === 'pending' && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate?.(order.id, 'INPROGRESS');
                }}
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Play className="h-4 w-4" />
                <span className="text-xs md:text-sm">Start Washing</span>
              </Button>
            )}
            
            {order.status.toLowerCase() === 'inprogress' && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate?.(order.id, 'COMPLETE');
                }}
                className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs md:text-sm">Mark Done</span>
              </Button>
            )}
            
            {order.status.toLowerCase() === 'complete' && (
              <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs md:text-sm font-medium">Work Complete!</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
