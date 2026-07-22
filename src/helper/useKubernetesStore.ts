import { create } from "zustand";

type Resource =
  | "pods"
  | "deployments"
  | "services"
  | "jobs"
  | "replicaSets"
  | "statefulSets"
  | "daemonSets"
  | "cronJobs"
  | "ingress"
  | "configMaps"
  | "secrets"
  | "persistentVolumes"
  | "namespaces";

interface SelectedItem {
  name: string;
  namespace: string;
}

interface KubernetesStore {
  selectedResource: Resource;
  selectedNamespace: string;
  selectedItem: SelectedItem | null;

  setSelectedResource: (resource: Resource) => void;
  setSelectedNamespace: (namespace: string) => void;
  setSelectedItem: (item: SelectedItem | null) => void;
}

export const KubernetesStore = create<KubernetesStore>((set) => ({
  selectedResource: "pods",
  selectedNamespace: "default",
  selectedItem: null,

  setSelectedResource: (resource) =>
    set({
      selectedResource: resource,
      selectedItem: null, // Clear previous selection
    }),

  setSelectedNamespace: (namespace) =>
    set({
      selectedNamespace: namespace,
      selectedItem: null, // clear previous selection
    }),

  setSelectedItem: (item) =>
    set({
      selectedItem: item,
    }),
}));