import { Injectable } from '@angular/core';
import { User } from '../user/user';

@Injectable()
export class Users {
    getUsers(): Promise<User[]> {
        return Promise.resolve([
            {
                email: '0000@gmail.com',
                username: '0000',
                name: 'zero zero',
                role: 'admin'
            },
            {
                email: '1111@gmail.com',
                username: '1111',
                name: 'one one',
                role: 'user'
            },
            {
                email: '2222@gmail.com',
                username: '2222',
                name: 'two two',
                role: 'user'
            },
            {
                email: '3333@gmail.com',
                username: '3333',
                name: 'three three',
                role: 'user'
            },
            {
                email: '4444@gmail.com',
                username: '4444',
                name: 'four four',
                role: 'user'
            },
            {
                email: '5555@gmail.com',
                username: '5555',
                name: 'five five',
                role: 'user'
            }
        ]);
    }
}