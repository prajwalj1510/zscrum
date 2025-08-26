import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const UserAvatar = ({ user }) => {
    return (
        <div className='flex items-center space-x-2 w-full'>
            <Avatar className='size-6'>
                <AvatarImage src={user?.imageUrl} alt={user?.name} />
                <AvatarFallback className='capitalize'>
                    {user ? user.name : '?'}
                </AvatarFallback>
            </Avatar>
            <span className='text-sm text-stone-500'>
                {user ? user.name : 'Unassigned'}
            </span>
        </div>
    )
}