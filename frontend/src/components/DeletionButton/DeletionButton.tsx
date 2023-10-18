import { FC, useRef, useState } from 'react'
import { Trash } from 'assets'

import { useOutsideAlerter } from 'utils'

interface DeletionButtonProps {
  primaryText: string
  secondaryText?: string
  handleDelete: () => Promise<void>
}

const DeletionButton: FC<DeletionButtonProps> = ({
  handleDelete,
  primaryText,
  secondaryText,
}): JSX.Element => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const divRef = useRef(null)
  useOutsideAlerter(divRef, setShowDeleteModal, showDeleteModal)

  return (
    <div
      ref={divRef}
      className="flex flex-col gap-2 items-end"
      onClick={() => setShowDeleteModal(!showDeleteModal)}
    >
      <Trash className={`w-8 h-8 stroke-red-500 cursor-pointer`} />
      {showDeleteModal && (
        <div className="mt-10 absolute bg-darkModeColor px-2 w-48 h-min-max border-2 border-red-500">
          <div className="w-full h-min-max text-center bg-darkModeColor py-4 gap-4 flex flex-col text-white justify-around">
            <span>{primaryText}</span>
            {secondaryText && <span className="text-xs">{secondaryText} </span>}
          </div>
          <div
            style={{ height: '1px' }}
            className={`w-full rounded dark:bg-brightModeColor bg-darkModeColor`}
          />
          <div className="w-full bg-darkModeColor flex flex-row px-2 py-3 justify-around items-center text-xs text-white">
            <button
              onClick={() => handleDelete()}
              className="border border-red-500 rounded p-2 hover:bg-red-500"
            >
              Bestätigen
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="border border-red-500 rounded p-2 hover:bg-red-500"
            >
              Abbruch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeletionButton
