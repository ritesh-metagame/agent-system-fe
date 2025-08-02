import RegisterPartnerForm from '@/components/register-partner-form'
import React, { Suspense } from 'react'

type Props = {}

export default function Page({}: Props) {
  return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
              
      <RegisterPartnerForm />
          </Suspense>
    </div>
  )
}