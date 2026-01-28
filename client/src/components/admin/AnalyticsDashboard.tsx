import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 132 },
  { month: 'Apr', revenue: 61000, orders: 178 },
  { month: 'May', revenue: 55000, orders: 156 },
  { month: 'Jun', revenue: 67000, orders: 189 },
  { month: 'Jul', revenue: 72000, orders: 201 },
  { month: 'Aug', revenue: 69000, orders: 195 },
  { month: 'Sep', revenue: 81000, orders: 223 },
  { month: 'Oct', revenue: 78000, orders: 215 },
  { month: 'Nov', revenue: 92000, orders: 256 },
  { month: 'Dec', revenue: 105000, orders: 298 },
];

const weeklyOrderTrends = [
  { day: 'Mon', orders: 42, avgValue: 289 },
  { day: 'Tue', orders: 38, avgValue: 312 },
  { day: 'Wed', orders: 45, avgValue: 278 },
  { day: 'Thu', orders: 51, avgValue: 301 },
  { day: 'Fri', orders: 68, avgValue: 345 },
  { day: 'Sat', orders: 85, avgValue: 412 },
  { day: 'Sun', orders: 72, avgValue: 378 },
];

const popularItems = [
  { name: 'Quinoa Bowl', orders: 456, revenue: 136044, growth: 12.5 },
  { name: 'Poke Bowl', orders: 398, revenue: 178502, growth: 8.3 },
  { name: 'Buddha Bowl', orders: 345, revenue: 96255, growth: 15.2 },
  { name: 'Keto Salad', orders: 312, revenue: 124488, growth: -2.1 },
  { name: 'Smoothie Bowl', orders: 289, revenue: 66247, growth: 22.8 },
];

const categoryDistribution = [
  { name: 'Healthy Bowls', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Salads', value: 25, color: 'hsl(var(--success))' },
  { name: 'Smoothies', value: 18, color: 'hsl(var(--coral))' },
  { name: 'Wraps', value: 12, color: 'hsl(var(--purple))' },
  { name: 'Desserts', value: 10, color: 'hsl(var(--muted-foreground))' },
];

const customerDemographics = [
  { age: '18-24', male: 120, female: 145 },
  { age: '25-34', male: 245, female: 312 },
  { age: '35-44', male: 178, female: 201 },
  { age: '45-54', male: 98, female: 132 },
  { age: '55+', male: 56, female: 78 },
];

const hourlyOrders = [
  { hour: '6AM', orders: 8 },
  { hour: '8AM', orders: 25 },
  { hour: '10AM', orders: 32 },
  { hour: '12PM', orders: 78 },
  { hour: '2PM', orders: 45 },
  { hour: '4PM', orders: 28 },
  { hour: '6PM', orders: 65 },
  { hour: '8PM', orders: 82 },
  { hour: '10PM', orders: 38 },
];

const kpiCards = [
  {
    title: 'Total Revenue',
    value: '₹8,25,000',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
    description: 'vs last month',
  },
  {
    title: 'Total Orders',
    value: '2,108',
    change: '+12.5%',
    trend: 'up',
    icon: ShoppingCart,
    description: 'vs last month',
  },
  {
    title: 'New Customers',
    value: '342',
    change: '+24.8%',
    trend: 'up',
    icon: Users,
    description: 'vs last month',
  },
  {
    title: 'Avg Order Value',
    value: '₹391',
    change: '-2.3%',
    trend: 'down',
    icon: Star,
    description: 'vs last month',
  },
];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('monthly');

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Track your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Last 7 Days</SelectItem>
            <SelectItem value="monthly">Last 30 Days</SelectItem>
            <SelectItem value="quarterly">Last 3 Months</SelectItem>
            <SelectItem value="yearly">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      kpi.trend === 'up'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue & Orders Trend</CardTitle>
            <CardDescription>Monthly revenue and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue (₹)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--coral))"
                    strokeWidth={2}
                    dot={false}
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Order Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Order Distribution</CardTitle>
            <CardDescription>Orders by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrderTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Selling Items</CardTitle>
            <CardDescription>Best performing menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{item.name}</p>
                      <Badge
                        variant="secondary"
                        className={
                          item.growth >= 0
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        }
                      >
                        {item.growth >= 0 ? '+' : ''}
                        {item.growth}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.orders} orders</span>
                      <span>₹{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.orders / 456) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Split</CardTitle>
            <CardDescription>Order distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Demographics</CardTitle>
            <CardDescription>Age and gender distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerDemographics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="age" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="male" fill="hsl(var(--primary))" name="Male" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="female" fill="hsl(var(--coral))" name="Female" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Order Hours</CardTitle>
            <CardDescription>When customers order the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
