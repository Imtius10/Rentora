"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/constants";
import type {
  AdminProperty,
  AdminRental,
  AdminStatistics,
  AdminUser,
  ApiResponse,
  Paginated,
  PaymentDTO,
  Property,
  RentalRequestLandlordDTO,
  RentalRequestTenantDTO,
  ReviewDTO,
  User,
} from "@/types";

interface ListOptions {
  params?: Record<string, string | number | undefined | null>;
  enabled?: boolean;
}

export function useProperties(options: ListOptions = {}) {
  const { params, enabled } = options;
  return useQuery<Paginated<Property>>({
    queryKey: [...QUERY_KEYS.properties, params ?? {}],
    queryFn: async () => {
      const res = await api.get<Property[]>("/properties", { params });
      return { data: res.data, meta: res.meta! };
    },
    enabled,
  });
}

export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get<Property>(`/properties/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery<string[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => {
      const res = await api.get<string[]>("/categories");
      return res.data;
    },
  });
}

export function useReviews(propertyId: string) {
  return useQuery<Paginated<ReviewDTO>>({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const res = await api.get<ReviewDTO[]>(`/reviews/property/${propertyId}`);
      return { data: res.data, meta: res.meta! };
    },
    enabled: Boolean(propertyId),
  });
}

export function useRentalRequestMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (vars: { propertyId: string; message?: string }) =>
      api.post<RentalRequestTenantDTO>("/rentals", vars),
    onSuccess,
  });
}

export function useCreateReview(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (vars: { rentalRequestId: string; rating: number; comment?: string }) =>
      api.post<ReviewDTO>("/reviews", vars),
    onSuccess,
  });
}

export function useCreatePayment(onSuccess?: (data: { checkoutUrl: string; sessionId: string }) => void) {
  return useMutation({
    mutationFn: (rentalRequestId: string) =>
      api.post<{ checkoutUrl: string; sessionId: string; payment: { id: string } }>(
        "/payments/create",
        { rentalRequestId }
      ),
    onSuccess: (res) => onSuccess?.(res.data),
  });
}

export function useMyRentalRequests(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<RentalRequestTenantDTO>>({
    queryKey: [...QUERY_KEYS.myRequests, params],
    queryFn: async () => {
      const res = await api.get<RentalRequestTenantDTO[]>("/rentals", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useMyPayments(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<PaymentDTO>>({
    queryKey: [...QUERY_KEYS.myPayments, params],
    queryFn: async () => {
      const res = await api.get<PaymentDTO[]>("/payments", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useLandlordRequests(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<RentalRequestLandlordDTO>>({
    queryKey: [...QUERY_KEYS.landlordRequests, params],
    queryFn: async () => {
      const res = await api.get<RentalRequestLandlordDTO[]>("/landlord/requests", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useUpdateRequestStatus(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: "APPROVED" | "REJECTED" }) =>
      api.patch<RentalRequestLandlordDTO>(`/landlord/requests/${vars.id}`, { status: vars.status }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QUERY_KEYS.landlordRequests }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.adminRentals }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.myRequests }),
      ]);
      onSuccess?.();
    },
  });
}

export function useMyProperties(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<Property & { rentalRequests: RentalRequestTenantDTO[] }>>({
    queryKey: [...QUERY_KEYS.myProperties, params],
    queryFn: async () => {
      const res = await api.get<any[]>("/landlord/properties", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function usePropertyRequests(propertyId: string) {
  return useQuery<RentalRequestLandlordDTO[]>({
    queryKey: ["property-requests", propertyId],
    queryFn: async () => {
      const res = await api.get<RentalRequestLandlordDTO[]>(
        `/landlord/properties/${propertyId}/requests`
      );
      return res.data;
    },
    enabled: Boolean(propertyId),
  });
}

export function useCreateProperty(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      title: string;
      description: string;
      price: number;
      location: string;
      category: string;
    }) => api.post<Property>("/landlord/properties", vars),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties });
      onSuccess?.();
    },
  });
}

export function useUpdateProperty(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      title: string;
      description: string;
      price: number;
      location: string;
      category: string;
    }) => api.put<Property>(`/landlord/properties/${vars.id}`, vars),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties });
      onSuccess?.();
    },
  });
}

export function useDeleteProperty(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/landlord/properties/${id}`),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.adminProperties }),
      ]);
      onSuccess?.();
    },
  });
}

// ==================== Admin ====================

export function useAdminUsers(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<AdminUser>>({
    queryKey: [...QUERY_KEYS.adminUsers, params],
    queryFn: async () => {
      const res = await api.get<AdminUser[]>("/admin/users", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useAdminProperties(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<AdminProperty>>({
    queryKey: [...QUERY_KEYS.adminProperties, params],
    queryFn: async () => {
      const res = await api.get<AdminProperty[]>("/admin/properties", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useAdminRentals(options: ListOptions = {}) {
  const { params } = options;
  return useQuery<Paginated<AdminRental>>({
    queryKey: [...QUERY_KEYS.adminRentals, params],
    queryFn: async () => {
      const res = await api.get<AdminRental[]>("/admin/rentals", { params });
      return { data: res.data, meta: res.meta! };
    },
  });
}

export function useAdminStatistics() {
  return useQuery<AdminStatistics>({
    queryKey: QUERY_KEYS.adminStatistics,
    queryFn: async () => {
      const res = await api.get<AdminStatistics>("/admin/statistics");
      return res.data;
    },
  });
}

export function useUpdateUserStatus(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      api.patch<AdminUser>(`/admin/users/${vars.id}/status`, { status: vars.status }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers });
      onSuccess?.();
    },
  });
}

export function useUpdateUserRole(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; role: "TENANT" | "LANDLORD" }) =>
      api.patch<AdminUser>(`/admin/users/${vars.id}/role`, { role: vars.role }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers });
      onSuccess?.();
    },
  });
}

export function useAdminDeleteProperty(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/admin/properties/${id}`),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QUERY_KEYS.adminProperties }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.myProperties }),
      ]);
      onSuccess?.();
    },
  });
}

export function useMe(): {
  data: User | undefined;
  isLoading: boolean;
} {
  return useQuery<User>({
    queryKey: QUERY_KEYS.me,
    queryFn: async () => {
      const res = await api.get<User>("/auth/me", { skipAuthRefresh: true });
      return res.data;
    },
    retry: false,
  });
}

export type { ApiResponse };