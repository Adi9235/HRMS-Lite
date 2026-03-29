export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state">
      <p>{message}</p>
      {onRetry ? (
        <button className="button secondary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  )
}
