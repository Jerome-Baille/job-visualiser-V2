export interface UserData {
    id?: number;
    username: string;
    email?: string;
    password: string;
    confirmPassword?: string;
}

export interface JobData {
    [key: string]: unknown;
    id?: number;
    name?: string;
    company?: string;
    location?: string;
    type?: string;
    link?: string;
    applicationDate?: string;
    applicationYear?: string;
    interviewDate?: string;
    decisionDate?: string;
    decision?: string;
}

interface Update {
    userId: number;
    update: string;
}

export interface TaskData {
    [key: string]: unknown;
    id?: number;
    description?: string;
    status?: 'Backlog' | 'In Progress' | 'Done';
    priority?: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    jobId?: number[];
    userUpdates?: Update[];
    userIds?: number[];
}

export interface TaskMenuProps {
    task: TaskData;
    setSelectedTask: (task: TaskData) => void;
    onOpen: () => void;
    onOpenDuplicate: () => void;
    onOpenEdit: () => void;
    tasks: TaskData[];
    setTasks: (tasks: TaskData[]) => void;
  }

export interface TaskDataProps {
    tasks: TaskData[];
    setTasks: (tasks: TaskData[]) => void;
}

export interface ProfileData {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    profilePicture?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    lastLoginAt?: string;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
}

export interface JobDataProps {
    data?: JobData;
    setData: (data: JobData) => void;
    isEmpty?: boolean;
}

export interface JobState {
    jobs: JobData[];
    setJobs?: (jobs: JobData[]) => void;
    jobFiltered?: JobData[];
    setJobFiltered: (jobFiltered: JobData[]) => void;
}

export interface TableProps {
    data: JobData;
    setData: (data: JobData) => void;
    isEmpty?: boolean;
}

export interface StorageKeys {
    JT_accessToken: string;
    JT_accessTokenExpireDate: string;
    JT_refreshToken: string;
    JT_refreshTokenExpireDate: string;
    userId?: string;
    userIdExpireDate?: string;
}

export interface LoginFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    errorMessage: string;
}

// Define the type for a column
export interface Column {
    label: string;
    accessor: string;
    sortable: boolean;
}

// Define the type for the props
export interface TableHeadProps {
    columns: Column[];
    handleSorting: (accessor: string, sortOrder: 'asc' | 'desc') => void;
}

export interface Status {
    label: string;
    value: string;
}

export interface TableBodyProps {
    jobs: JobData[];
    columns: Column[];
}

export interface AuthState {
    isAuthenticated: boolean;
}

export interface FormValues {
    [key: string]: string | number | undefined | 'Remote' | 'Hybrid' | 'On site' | 'positive' | 'negative' | 'in progress' | 'expired' | 'unknown';
    name: string;
    company: string;
    location: string;
    type: 'Remote' | 'Hybrid' | 'On site';
    link: string;
    applicationDate: string;
    applicationYear: string;
    interviewDate?: string;
    decisionDate?: string;
    decision: 'positive' | 'negative' | 'in progress' | 'expired' | 'unknown';
}

import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface SidebarLinkProps {
    to: string;
    text: string;
    label: string;
    icon: IconProp;
    isSidebarClosed?: boolean;
}

export interface DashboardProps {
    [key: string]: unknown;
    jobs: JobData[];
}

export interface DataPointMonth {
    month: string;
    count: number;
}

export interface BarChartData {
    day: string;
    count: number;
}

export interface LineChartProps {
    data: DataPointMonth[];
    monthOrder: string[];
    width: number;
    height: number;
}

export interface BarChartProps {
    data: BarChartData[];
    width: number;
    height: number;
}