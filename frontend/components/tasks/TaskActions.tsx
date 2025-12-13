import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CheckCircleIcon, LinkIcon } from '@/components/Icons';
import { TASK_STATES } from '@/lib/taskUtils';

interface TaskActionsProps {
  taskId: bigint;
  state: number;
  creator: string;
  worker: string;
  isExpired: boolean;
  onAcceptTask: () => void;
  onSubmitWork: (url: string) => void;
  onApproveWork: () => void;
  onCancelTask: () => void;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash?: string;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  taskId,
  state,
  creator,
  worker,
  isExpired,
  onAcceptTask,
  onSubmitWork,
  onApproveWork,
  onCancelTask,
  isPending,
  isConfirming,
  isConfirmed,
  hash,
}) => {
  const { address } = useAccount();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const isCreator = address === creator;
  const isWorker = address === worker;
  const isUnassigned = worker === '0x0000000000000000000000000000000000000000';

  const validateUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setSubmissionUrl(url);
    if (url && !validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://github.com/...)');
    } else {
      setUrlError('');
    }
  };

  const handleSubmitWork = () => {
    if (!submissionUrl.trim()) {
      setUrlError("Please enter a submission URL");
      return;
    }
    if (!validateUrl(submissionUrl)) {
      setUrlError("Invalid URL format");
      return;
    }
    onSubmitWork(submissionUrl);
    setSubmissionUrl('');
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-6">Actions</h2>

      {/* Creator Actions */}
      {isCreator && (
        <div className="space-y-4">
          {state === TASK_STATES.OPEN && (
            <Button
              onClick={onCancelTask}
              disabled={isPending || isConfirming}
              variant="danger"
              className="w-full"
            >
              {isPending ? 'Cancelling...' : 'Cancel Task'}
            </Button>
          )}
          {state === TASK_STATES.SUBMITTED && (
            <Button
              onClick={onApproveWork}
              disabled={isPending || isConfirming}
              icon={CheckCircleIcon}
              className="w-full"
            >
              {isPending ? 'Approving...' : 'Approve Work & Pay Worker'}
            </Button>
          )}
          {state === TASK_STATES.ASSIGNED && (
            <p className="text-slate-400 text-center">Waiting for worker to submit work...</p>
          )}
          {state === TASK_STATES.COMPLETED && (
            <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-center">
              Task Completed!
            </div>
          )}
        </div>
      )}

      {/* Worker Actions */}
      {!isCreator && (
        <div className="space-y-4">
          {state === TASK_STATES.OPEN && isUnassigned && (
            <Button
              onClick={onAcceptTask}
              disabled={isPending || isConfirming || isExpired}
              className="w-full"
            >
              {isPending ? 'Accepting...' : 'Accept Task'}
            </Button>
          )}
          {isWorker && state === TASK_STATES.ASSIGNED && (
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  Submit Work
                </h3>
                <Input
                  placeholder="https://github.com/your-pr-link"
                  value={submissionUrl}
                  onChange={handleUrlChange}
                  error={urlError}
                  className="mb-2"
                />
                <p className="text-xs text-slate-500 mb-4">
                  Provide a link to your work (e.g., GitHub PR, Google Drive, Figma).
                </p>
                <Button
                  onClick={handleSubmitWork}
                  disabled={isPending || isConfirming || !!urlError || !submissionUrl}
                  className="w-full"
                >
                  {isPending ? 'Submitting...' : 'Submit Work'}
                </Button>
              </div>
            </div>
          )}
          {isWorker && state === TASK_STATES.SUBMITTED && (
            <p className="text-slate-400 text-center">Waiting for creator approval...</p>
          )}
        </div>
      )}

      {/* Transaction Status */}
      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-center">
          Transaction confirmed!
        </div>
      )}
      {hash && (
        <div className="mt-2 text-xs text-slate-500 text-center break-all">
          Transaction Hash: {hash}
        </div>
      )}
    </div>
  );
};

export default TaskActions;

