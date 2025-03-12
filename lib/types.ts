export interface TopicSelectionState {
  topicId: string;
  topicTitle: string;
  student1Name: string;
  student1USN: string;
  student2Name: string;
  student2USN: string;
  timestamp: string;
}

export const STORAGE_KEY = "topic_selection_state"; 