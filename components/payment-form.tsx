'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PaymentFormProps {
  roomPrice: number
  numberOfNights: number
  onConfirm: (finalPrice: number, advanceAmount: number) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaymentForm({ 
  roomPrice, 
  numberOfNights, 
  onConfirm, 
  isOpen, 
  onOpenChange 
}: PaymentFormProps) {
  const [modifiedPrice, setModifiedPrice] = useState(roomPrice * numberOfNights)
  const [advanceAmount, setAdvanceAmount] = useState(modifiedPrice * 0.3)

  const handleConfirm = () => {
    onConfirm(modifiedPrice, advanceAmount)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-dinesh-background dark:bg-dinesh-text">
        <DialogHeader>
          <DialogTitle className="text-dinesh-text dark:text-dinesh-background">Payment Details</DialogTitle>
          <DialogDescription className="text-dinesh-secondary dark:text-dinesh-accent">
            Review and confirm your booking payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-dinesh-text dark:text-dinesh-background">
              <span>Room Price per Night:</span>
              <span>${roomPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-dinesh-text dark:text-dinesh-background">
              <span>Number of Nights:</span>
              <span>{numberOfNights}</span>
            </div>
            <div className="flex justify-between font-bold text-dinesh-text dark:text-dinesh-background">
              <span>Total Amount:</span>
              <span>${(roomPrice * numberOfNights).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modified-price">
              Modified Price (if applicable)
            </Label>
            <Input
              id="modified-price"
              type="number"
              value={modifiedPrice}
              onChange={(e) => setModifiedPrice(Number(e.target.value))}
              className="border-dinesh-secondary bg-dinesh-background text-dinesh-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advance">
              Advance Payment Amount
            </Label>
            <Input
              id="advance"
              type="number"
              value={advanceAmount}
              onChange={(e) => setAdvanceAmount(Number(e.target.value))}
              className="border-dinesh-secondary bg-dinesh-background text-dinesh-text"
            />
            <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
              Remaining Amount: ${(modifiedPrice - advanceAmount).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleConfirm}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

