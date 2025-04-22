import { useState } from 'react';
import { useTransactions } from '@/lib/transaction-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const categories = {
  income: ['salary', 'freelance', 'investment', 'gift'],
  expense: ['food', 'transportation', 'housing', 'utilities', 'entertainment', 'shopping', 'healthcare', 'education', 'other'],
  transfer: ['transfer']
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface TransactionFormProps {
  initialData?: {
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    category: string;
    description?: string;
    date: string;
    status: 'pending' | 'completed' | 'failed';
    tags?: string[];
  };
  onSubmit: (data: any) => Promise<void>;
}

export default function TransactionForm({ initialData, onSubmit }: TransactionFormProps) {
  const { user } = useAuth();
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>(initialData?.type || 'expense');
  const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || '0');
  const [category, setCategory] = useState<string>(initialData?.category || categories[type][0]);
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [date, setDate] = useState<Date>(initialData?.date ? new Date(initialData.date) : new Date());
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>(initialData?.status || 'completed');
  const [tags, setTags] = useState<string>(initialData?.tags?.join(', ') || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const transactionData = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: date.toISOString(),
        status,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        userId: user?._id
      };

      await onSubmit(transactionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
        <CardDescription>Enter the transaction details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense' | 'transfer') => {
              setType(value);
              setCategory(''); // Reset category when type changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: 'pending' | 'completed' | 'failed') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. work, food, travel"
            />
          </div>

          <Button type="submit" className="w-full">
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 