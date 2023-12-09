'use client'

import { useState, useContext, useRef, RefObject } from 'react'
import Image from 'next/image'
import { Spinner } from 'assets'
import { uploadProfileImage } from 'api'
import { useCookies } from 'react-cookie'
import { NextAppContext } from 'components'

export default function Page() {
  const { myUserId } = useContext(NextAppContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cookie] = useCookies(['jwtToken'])

  const handleUploadProfileImage = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await uploadProfileImage({
        jwtToken: cookie.jwtToken,
        body: {
          userId: myUserId,
          ...(selectedImage && { imageBase64String: selectedImage }),
        },
      })
      if (response.statusCode === 200) {
        setIsLoading(false)
        setSelectedImage('')
        if (fileInputRef && fileInputRef.current)
          fileInputRef.current.value = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleImageChange = (e: any) => {
    const data = new FileReader()
    data.addEventListener('load', () => {
      setSelectedImage(data.result as string)
    })
    data.readAsDataURL(e.target.files[0])
  }

  return (
    <div className="py-16 w-full flex flex-col sm:flex-row sm:gap-0 gap-16">
      <div className="h-full w-full xs:max-w-xs px-8 flex flex-col min-w-full sm:min-w-0 justify-center items-center divide-y gap-12 divide-blue-200">
        <div
          className={`h-32 w-32 bg-black rounded-full flex items-center overflow-hidden`}
        >
          {localStorage.getItem('profileImage') && (
            <Image
              className={`cursor-pointer`}
              alt=""
              width={500}
              height={500}
              src={localStorage.getItem('profileImage') || ''}
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          <div className="w-full text-center pt-12 flex flex-col gap-4">
            <span className="dark:text-brightModeColor text-darkModeColor">
              Neues Profilbild hochladen:
            </span>
            <input
              ref={fileInputRef as RefObject<HTMLInputElement>}
              className="text-white"
              type={!isLoading ? 'file' : 'reset'}
              accept=".png,.jpg,.jpeg,.PNG"
              onChange={handleImageChange}
            />
          </div>
          <div className="w-full flex gap-4 flex-row justify-center">
            <button
              onClick={() => {
                if (selectedImage) handleUploadProfileImage()
              }}
              className={`dark:text-brightModeColor text-darkModeColor flex flex-row gap-4 justify-center border-2 border-red-500 hover:bg-red-500 hover:text-white rounded p-2 w-full`}
            >
              {isLoading ? (
                <Spinner className="w-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
              ) : (
                'Hochladen'
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white h-full w-full h-72"></div>
    </div>
  )
}
