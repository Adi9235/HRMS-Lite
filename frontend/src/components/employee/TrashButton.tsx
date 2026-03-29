import { Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'

export default function TrashButton({ loading, onClick }: { loading: boolean; onClick: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button className="icon-button danger" onClick={onClick} type="button" disabled={loading}>
      <Trash2 size={16} />
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}
