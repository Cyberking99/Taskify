import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CheckCircleIcon } from '@/components/Icons';
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

  const isCreator = address === creator;
  const isWorker = address === worker;
  const isUnassigned = worker === '0x0000000000000000000000000000000000000000';

  const handleSubmitWork = () => {
    if (!submissionUrl.trim()) {
      alert("Please enter a submission URL");
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
              <Input
                label="Submission URL"
                placeholder="https://github.com/..."
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
              />
              <Button
                onClick={handleSubmitWork}
                disabled={isPending || isConfirming}
                className="w-full"
              >
                {isPending ? 'Submitting...' : 'Submit Work'}
              </Button>
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

