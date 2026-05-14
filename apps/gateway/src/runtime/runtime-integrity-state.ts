type RuntimeIntegrityState = {
  verified: boolean;
  verifiedAt: string | null;
  activeSnapshotHash: string | null;
  failureReason: string | null;
};

const state: RuntimeIntegrityState = {
  verified: false,
  verifiedAt: null,
  activeSnapshotHash: null,
  failureReason: null,
};

export function setRuntimeIntegrityState(nextState: RuntimeIntegrityState): void {
  state.verified = nextState.verified;
  state.verifiedAt = nextState.verifiedAt;
  state.activeSnapshotHash = nextState.activeSnapshotHash;
  state.failureReason = nextState.failureReason;
}

export function getRuntimeIntegrityState(): RuntimeIntegrityState {
  return {
    ...state,
  };
}
