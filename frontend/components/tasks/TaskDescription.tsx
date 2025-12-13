import React from 'react';

interface TaskDescriptionProps {
  description: string;
  submissionUrl?: string;
  showSubmission?: boolean;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  description,
  submissionUrl,
  showSubmission = false,
}) => {
  return (
    <>
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {description}
        </p>
      </div>

      {showSubmission && submissionUrl && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-4">Work Submission</h2>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Submission URL</p>
            <a
              href={submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {submissionUrl}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDescription;

