//DONE is when it is done, but not processed yet
//FINISHED is when it is done and processed
export enum TASK_STATUS {
    PENDING = 1,
    DOING = 2,
    DONE = 3,
    FINISHED = 4,
    ARCHIVED = 5
}

export enum TASK_PRIORITY {
    HIGH = 1,
    MEDIUM = 2,
    LOW = 3
}

export const getStatusString = (status: TASK_STATUS) => {
    switch (status) {
        case TASK_STATUS.PENDING:
            return "Pending";
        case TASK_STATUS.DOING:
            return "Doing";
        case TASK_STATUS.DONE:
            return "Done";
        case TASK_STATUS.FINISHED:
            return "Finished";
        case TASK_STATUS.ARCHIVED:
            return "Archived";
        default:
            return "Unknown";
    }
}

export const getPrioritiesMap = () => {
    return {
        [TASK_PRIORITY.HIGH]: "High",
        [TASK_PRIORITY.MEDIUM]: "Medium",
        [TASK_PRIORITY.LOW]: "Low",
    }
}