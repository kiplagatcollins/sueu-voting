export interface Voter {
  id: number;
  name: string;
  email: string;
  student_id: string;
  is_admin: boolean;
  has_voted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  voter: Voter;
  token: string;
}

export interface Position {
  id: number;
  title: string;
  order_idx: number;
  max_votes: number;
  election_id: number;
  candidates?: Candidate[];
}

export interface Candidate {
  id: number;
  name: string;
  bio?: string;
  avatar_url?: string;
  position_id: number;
  election_id: number;
}

export interface Election {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  positions: Position[];
  candidates?: Candidate[];
}

export interface CandidateResult {
  id: number;
  name: string;
  bio?: string;
  votes: number;
  rank: number;
  avatar?: string;
}

export interface PositionResult {
  position_id: number;
  position: string;
  max_votes: number;
  candidates: CandidateResult[];
}

export interface ResultsSummary {
  election_id: number;
  election_title: string;
  positions: PositionResult[];
  total_voters: number;
  total_votes_cast: number;
  voter_turnout_pct: number;
}

export interface Vote {
  id: number;
  voter_id: number;
  candidate_id: number;
  position_id: number;
  election_id: number;
  candidate: Candidate;
  position: Position;
  created_at: string;
}

export interface ApiError {
  error: string;
}
