export interface Login_in {
    email: string;
    password: string
}

export interface KubernetesHealthData {
    clusterName: string
    clusterStatus: string
    clusterId: string

    registeredClusters: Record<string, number | string>[]

    nodeReadiness: {
        percentage: number
        ready: number
        total: number
        label: string
    }

    workloadStability: {
        percentage: number
        running: number
        unhealthy: number
        restarts: number
        label: string
    }

    deployments: {
        total: number
        label: string
    }

    attention: {
        count: number
        label: string
    }

    signals: {
        name: string
        status: string
        value: string
    }[]
}