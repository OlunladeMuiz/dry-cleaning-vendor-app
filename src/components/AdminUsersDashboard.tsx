import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Search, Users, Store, Truck, X, Calendar, Mail, Phone, MapPin } from "lucide-react";
import type { User, UserRole } from "../types";
import { TrinityLogo } from "./TrinityLogo";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "../utils/supabase/client";

interface AdminUsersDashboardProps {
  onClose: () => void;
}

// Mock data for demonstration - Replace with real API call when backend is ready
const generateMockUsers = (): User[] => {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@trinity.edu",
      phone: "(210) 555-0101",
      role: "student",
      address: "123 Trinity Hall, San Antonio, TX 78212",
      createdAt: new Date(2024, 10, 1).toISOString(),
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@trinity.edu",
      phone: "(210) 555-0102",
      role: "student",
      address: "456 Campus Drive, San Antonio, TX 78212",
      createdAt: new Date(2024, 10, 5).toISOString(),
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@trinity.edu",
      phone: "(210) 555-0103",
      role: "student",
      address: "789 University Blvd, San Antonio, TX 78212",
      createdAt: new Date(2024, 10, 8).toISOString(),
    },
    {
      id: "4",
      name: "Sparkle Cleaners",
      email: "info@sparklecleaners.com",
      phone: "(210) 555-0201",
      role: "vendor",
      address: "101 Main Street, San Antonio, TX 78205",
      createdAt: new Date(2024, 9, 15).toISOString(),
    },
    {
      id: "5",
      name: "Premium Dry Cleaning",
      email: "contact@premiumdrycleaning.com",
      phone: "(210) 555-0202",
      role: "vendor",
      address: "202 Commerce St, San Antonio, TX 78205",
      createdAt: new Date(2024, 9, 20).toISOString(),
    },
    {
      id: "6",
      name: "David Martinez",
      email: "david.martinez@deliveryagent.com",
      phone: "(210) 555-0301",
      role: "agent",
      address: "303 Delivery Lane, San Antonio, TX 78204",
      createdAt: new Date(2024, 9, 25).toISOString(),
    },
    {
      id: "7",
      name: "Jessica Williams",
      email: "jessica.williams@trinity.edu",
      phone: "(210) 555-0104",
      role: "student",
      address: "567 Student Center, San Antonio, TX 78212",
      createdAt: new Date(2024, 10, 12).toISOString(),
    },
    {
      id: "8",
      name: "Express Cleaners",
      email: "hello@expresscleaners.com",
      phone: "(210) 555-0203",
      role: "vendor",
      address: "404 Fast Lane, San Antonio, TX 78205",
      createdAt: new Date(2024, 10, 2).toISOString(),
    },
    {
      id: "9",
      name: "Carlos Ramirez",
      email: "carlos.ramirez@deliveryagent.com",
      phone: "(210) 555-0302",
      role: "agent",
      address: "505 Route 66, San Antonio, TX 78204",
      createdAt: new Date(2024, 10, 3).toISOString(),
    },
    {
      id: "10",
      name: "Amanda Thompson",
      email: "amanda.thompson@trinity.edu",
      phone: "(210) 555-0105",
      role: "student",
      address: "890 Residence Hall, San Antonio, TX 78212",
      createdAt: new Date(2024, 10, 14).toISOString(),
    },
  ];
};

export function AdminUsersDashboard({ onClose }: AdminUsersDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    vendors: 0,
    agents: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      let usersList: User[] = [];

      // Method 1: Try to fetch from users table
      const { data: usersTableData, error: usersTableError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!usersTableError && usersTableData && usersTableData.length > 0) {
        usersList = usersTableData.map((u: any) => ({
          id: u.id,
          name: u.name || u.full_name || 'Unknown',
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role || 'student',
          address: u.address || 'N/A',
          createdAt: u.created_at || new Date().toISOString(),
        }));
      }
      
      // If no data from users table, use mock data
      // Note: auth.users requires service role key to access via admin API
      // For now, registered users will appear after you set up a users table or use mock data
      if (usersList.length === 0) {
        console.log('Using mock user data - no real users found in database');
        console.log('Tip: Create a "users" table in Supabase or use Supabase triggers to sync auth.users to a public users table');
        usersList = generateMockUsers();
      }
      
      setUsers(usersList);
      
      // Calculate stats
      const studentCount = usersList.filter((u: User) => u.role === "student").length;
      const vendorCount = usersList.filter((u: User) => u.role === "vendor").length;
      const agentCount = usersList.filter((u: User) => u.role === "agent").length;
      
      setStats({
        total: usersList.length,
        students: studentCount,
        vendors: vendorCount,
        agents: agentCount,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Fallback to mock data on error
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      
      const studentCount = mockUsers.filter((u: User) => u.role === "student").length;
      const vendorCount = mockUsers.filter((u: User) => u.role === "vendor").length;
      const agentCount = mockUsers.filter((u: User) => u.role === "agent").length;
      
      setStats({
        total: mockUsers.length,
        students: studentCount,
        vendors: vendorCount,
        agents: agentCount,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((u) => u.role === selectedRole);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery)
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "vendor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "agent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <Users className="w-4 h-4" />;
      case "vendor":
        return <Store className="w-4 h-4" />;
      case "agent":
        return <Truck className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrinityLogo variant="full" size="sm" />
              <Badge variant="secondary" className="text-xs">Admin Panel</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white">Users Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all registered users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900 dark:text-white">{stats.total}</div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-blue-600 dark:text-blue-400">{stats.students}</div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-purple-600 dark:text-purple-400">{stats.vendors}</div>
                <Store className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                Delivery Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-green-600 dark:text-green-400">{stats.agents}</div>
                <Truck className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole | "all")} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto dark:bg-gray-700">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="vendor">Vendors</TabsTrigger>
                  <TabsTrigger value="agent">Agents</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Registered Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">Name</TableHead>
                      <TableHead className="dark:text-gray-300">Email</TableHead>
                      <TableHead className="dark:text-gray-300">Phone</TableHead>
                      <TableHead className="dark:text-gray-300">Role</TableHead>
                      <TableHead className="dark:text-gray-300">Address</TableHead>
                      <TableHead className="dark:text-gray-300">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="dark:border-gray-700">
                        <TableCell className="dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center gap-2 max-w-xs">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{user.address || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={fetchUsers} variant="outline" className="dark:border-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Refresh Users
              </Button>
              <Button
                onClick={() => {
                  const csv = generateCSV(filteredUsers);
                  downloadCSV(csv, "cleanu-users.csv");
                }}
                variant="outline"
                className="dark:border-gray-600"
              >
                📊 Export to CSV
              </Button>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="dark:border-gray-600"
              >
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to generate CSV
function generateCSV(users: User[]): string {
  const headers = ["Name", "Email", "Phone", "Role", "Address", "Joined"];
  const rows = users.map((user) => [
    user.name,
    user.email,
    user.phone,
    user.role,
    user.address || "N/A",
    new Date(user.createdAt).toLocaleDateString(),
  ]);

  return [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");
}

// Helper function to download CSV
function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
