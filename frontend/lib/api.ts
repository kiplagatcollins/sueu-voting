import type {
  Election,
  LoginResponse,
  ResultsSummary,
  Voter,
  Vote,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new ApiClientError(body.error ?? "Request failed", res.status);
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    const resp = await this.request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(resp.token);
    return resp;
  }

  async getProfile(): Promise<Voter> {
    return this.request<Voter>("/api/v1/auth/profile");
  }

  // Election
  async getActiveElection(): Promise<Election> {
    return this.request<Election>("/api/v1/elections/active");
  }

  // Results
  async getResults(): Promise<ResultsSummary> {
    return this.request<ResultsSummary>("/api/v1/results");
  }

  // Voting
  async castVote(candidateId: number, positionId: number): Promise<void> {
    await this.request("/api/v1/vote", {
      method: "POST",
      body: JSON.stringify({
        candidate_id: candidateId,
        position_id: positionId,
      }),
    });
  }

  async getMyVotes(): Promise<Vote[]> {
    return this.request<Vote[]>("/api/v1/votes/mine");
  }

  // Admin
  async seedData(): Promise<void> {
    await this.request("/api/v1/admin/seed", { method: "POST" });
  }

  async resetVotes(): Promise<void> {
    await this.request("/api/v1/admin/reset", { method: "POST" });
  }
}

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

export const api = new ApiClient();
