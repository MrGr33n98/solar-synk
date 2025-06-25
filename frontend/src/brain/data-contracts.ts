/** AnalyticsData */
export interface AnalyticsData {
  /** Total Views */
  total_views: number;
  /** Views Past 30 Days */
  views_past_30_days: number;
  /** Daily Views */
  daily_views: Record<string, any>[];
}

/** Company */
export interface Company {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Website */
  website?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** City */
  city?: string | null;
  /** State */
  state?: string | null;
  /** Years In Business */
  years_in_business?: number | null;
}

/** CompanyProfile */
export interface CompanyProfile {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Website */
  website?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** City */
  city?: string | null;
  /** State */
  state?: string | null;
  /** Years In Business */
  years_in_business?: number | null;
  /**
   * Products
   * @default []
   */
  products?: Product[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** Product */
export interface Product {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Brand */
  brand?: string | null;
  /** Category Id */
  category_id: number;
  /** Supplier Id */
  supplier_id: number;
  /** Specifications */
  specifications?: null;
  /** Image Url */
  image_url?: string | null;
  /** Price Info */
  price_info?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** RegistrationRequest */
export interface RegistrationRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
  /** Role */
  role: string;
  /** Full Name */
  full_name: string;
  /** Company Name */
  company_name?: string | null;
}

/** Review */
export interface Review {
  /** Id */
  id: number;
  /** Product Id */
  product_id: number;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Rating */
  rating: number;
  /** Comment */
  comment?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** ReviewRequest */
export interface ReviewRequest {
  /** Product Id */
  product_id: number;
  /** Rating */
  rating: number;
  /** Comment */
  comment: string;
}

/** UserResponse */
export interface UserResponse {
  /** Id */
  id: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Role */
  role: string;
  /** Full Name */
  full_name: string;
  /** Company Name */
  company_name?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type RegisterUserData = UserResponse;

export type RegisterUserError = HTTPValidationError;

export interface ListProductsParams {
  /**
   * Category
   * Filter by category name
   */
  category?: string;
  /**
   * Brand
   * Filter by brand name
   */
  brand?: string;
}

/** Response List Products */
export type ListProductsData = Product[];

export type ListProductsError = HTTPValidationError;

export interface GetProductParams {
  /** Product Id */
  productId: number;
}

export type GetProductData = Product;

export type GetProductError = HTTPValidationError;

export interface ListReviewsForProductParams {
  /** Product Id */
  productId: number;
}

/** Response List Reviews For Product */
export type ListReviewsForProductData = Review[];

export type ListReviewsForProductError = HTTPValidationError;

export type SubmitReviewData = Review;

export type SubmitReviewError = HTTPValidationError;

export interface SearchCompaniesParams {
  /**
   * State
   * Filter by state (e.g., 'SP')
   */
  state?: string;
  /**
   * City
   * Filter by city
   */
  city?: string;
}

/** Response Search Companies */
export type SearchCompaniesData = Company[];

export type SearchCompaniesError = HTTPValidationError;

export interface GetCompanyProfileParams {
  /** Company Id */
  companyId: number;
}

export type GetCompanyProfileData = CompanyProfile;

export type GetCompanyProfileError = HTTPValidationError;

export type GetAnalyticsData = AnalyticsData;
