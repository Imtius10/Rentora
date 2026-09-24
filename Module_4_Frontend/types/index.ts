export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  activeStatus: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LandlordBrief {
  id: string;
  name: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  landlord?: LandlordBrief;
}

export interface RentalRequestTenantDTO {
  id: string;
  propertyId: string;
  tenantId: string;
  message: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    landlord: LandlordBrief;
  };
  tenant: LandlordBrief;
}

export interface RentalRequestLandlordDTO {
  id: string;
  propertyId: string;
  tenantId: string;
  message: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
  };
  tenant: LandlordBrief & { activeStatus?: UserStatus };
}

export interface PaymentDTO {
  id: string;
  rentalRequestId: string;
  tenantId: string;
  amount: number;
  transactionId: string | null;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: {
    id: string;
    status: RentalStatus;
    message: string | null;
    createdAt: string;
    property: {
      id: string;
      title: string;
      price: number;
      location: string;
    };
  };
}

export interface ReviewDTO {
  id: string;
  rentalRequestId: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
  };
  property?: {
    id: string;
    title: string;
    location: string;
  };
}

export interface AdminUser extends User {}

export interface AdminProperty extends Omit<Property, "landlord"> {
  landlord: LandlordBrief & { activeStatus?: UserStatus };
  rentalRequests: {
    id: string;
    status: RentalStatus;
    createdAt: string;
    tenant: LandlordBrief;
  }[];
}

export interface AdminRental
  extends Omit<RentalRequestLandlordDTO, "property"> {
  property: RentalRequestLandlordDTO["property"] & {
    landlord: LandlordBrief;
  };
}

export interface AdminStatistics {
  users: { total: number; landlords: number; tenants: number };
  properties: { total: number };
  rentalRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
  errorDetails?: unknown;
}

export interface Paginated<T> {
  data: T[];
  meta: Meta;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Category {
  label: string;
  value: string;
  icon: string;
}