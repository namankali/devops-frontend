import { create } from "zustand";
import type { Environment } from "./types";

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
  selectedProvider: string
  selectedEnvironment: Environment
  selectedDisplayName: string

  setSelectedResource: (resource: Resource) => void;
  setSelectedNamespace: (namespace: string) => void;
  setSelectedItem: (item: SelectedItem | null) => void;
  setSelectedProvider: (provider: string) => void
  setSelectedEnvironment: (env: Environment) => void
  setSelectedDisplayName: (ds: string) => void
}

export const KubernetesStore = create<KubernetesStore>((set) => ({
  selectedResource: "pods",
  selectedNamespace: "all",
  selectedItem: null,
  selectedProvider: "",
  selectedEnvironment: null,
  selectedDisplayName: "",

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

  setSelectedProvider: (provider) => set({
    selectedProvider: provider
  }),

  setSelectedEnvironment: (env) => set({
    selectedEnvironment: env
  }),

  setSelectedDisplayName: (ds) => set({
    selectedDisplayName: ds ?? ""
  })
}));