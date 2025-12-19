export interface AuthUserProfile {
	display_name: string | null;
	phone_number: string | null;
	age: number | null;
	country: string | null;
	country_code: string | null;
	profession: string | null;
	profile_image: string | null;
	email_verified: boolean;
}

export interface AuthUser {
	id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	is_staff: boolean;
	profile: AuthUserProfile;
}

export interface RegisterResponse {
	detail: string;
	uidb64: string;
	token: string;
	csrf_token?: string;
}

export interface ResendOtpResponse {
	detail: string;
	uidb64?: string;
	token?: string;
	csrf_token?: string;
}

export interface VerifyOtpPayload {
	email?: string;
	otp_code: string;
}

export interface VerifyOtpResponse {
	detail: string;
	user: AuthUser;
	csrf_token?: string;
}

export interface LoginSuccessResponse {
	detail: string;
	user: AuthUser;
	csrf_token?: string;
	requires_verification?: false;
}

export interface LoginVerificationRequiredResponse {
	detail: string;
	requires_verification: true;
	uidb64?: string;
	token?: string;
	csrf_token?: string;
}

export type LoginResponse = LoginSuccessResponse | LoginVerificationRequiredResponse;

export interface LogoutResponse {
	detail: string;
	csrf_token?: string;
}

export interface PasswordResetResponse {
	detail: string;
	csrf_token?: string;
}

export interface ProfileResponse {
	user: AuthUser;
	detail?: string;
	csrf_token?: string;
}

export interface ProfileUpdatePayload {
	first_name?: string;
	last_name?: string;
	display_name?: string;
	phone_number?: string;
	age?: number | null;
	country?: string;
	country_code?: string;
	profession?: string;
	profile_image?: File | null;
	remove_profile_image?: boolean;
}
