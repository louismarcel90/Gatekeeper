import { ManagedRoute, Policy, Snapshot } from "../domain/types";

class InMemoryStore {
  private routes: ManagedRoute[] = [];
  private policies: Policy[] = [];
  private snapshots: Snapshot[] = [];

  getRoutes(): ManagedRoute[] {
    return [...this.routes];
  }

  getPolicies(): Policy[] {
    return [...this.policies];
  }

  addRoute(route: ManagedRoute): ManagedRoute {
    const alreadyExists = this.routes.some((item) => item.id === route.id);
    if (alreadyExists) {
      throw new Error(`Route with id "${route.id}" already exists.`);
    }

    this.routes.push(route);
    return route;
  }

  addPolicy(policy: Policy): Policy {
    const routeExists = this.routes.some((route) => route.id === policy.route_id);
    if (!routeExists) {
      throw new Error(`Route "${policy.route_id}" does not exist.`);
    }

    const alreadyExists = this.policies.some((item) => item.id === policy.id);
    if (alreadyExists) {
      throw new Error(`Policy with id "${policy.id}" already exists.`);
    }

    this.policies.push(policy);
    return policy;
  }

  addSnapshot(snapshot: Snapshot): Snapshot {
    this.snapshots.push(snapshot);
    return snapshot;
  }

  getLatestSnapshot(): Snapshot | null {
    if (this.snapshots.length === 0) {
      return null;
    }

    return this.snapshots[this.snapshots.length - 1] ?? null;
  }

  getNextSnapshotVersion(): number {
    const latest = this.getLatestSnapshot();
    return latest ? latest.version + 1 : 1;
  }
}

export const store = new InMemoryStore();