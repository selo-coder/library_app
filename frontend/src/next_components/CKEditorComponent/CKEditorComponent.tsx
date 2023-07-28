'use client'

import { FC } from 'react'
import dynamic from 'next/dynamic'

const CKEditor = dynamic(
  async () => (await import('@ckeditor/ckeditor5-react/dist')).CKEditor,
  {
    ssr: false,
  }
)

interface CKEditorProps {
  content: string
  setContent: (content: string) => void
}

const CKEditorComponent: FC<CKEditorProps> = ({
  content,
  setContent,
}): JSX.Element => {
  return (
    <CKEditor
      onError={(error) => {
        console.log(error)
      }}
      editor={require('@ckeditor/ckeditor5-build-classic')}
      data={content}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(event, editor: any) => {
        setContent(editor.getData())
      }}
    />
  )
}

export default CKEditorComponent
