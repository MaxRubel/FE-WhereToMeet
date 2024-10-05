// RegistrationForm.tsx
import React from 'react';
import "./RegistrationForm.css";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useAuth } from '@/context/auth/auth';

export default function RegistrationForm() {
  const { user } = useAuth();
  console.log(user);

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    }
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <div className="registration-form-container">
      <h2 style={{ textAlign: 'left' }}>
        <strong>Welcome to WhereToMeet!</strong>
      </h2>
      <h2 style={{ textAlign: 'left', marginBottom: '3em' }}>Please tell us a little about yourself.</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="registration-form">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type='email'
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="submit-button">Submit</Button>
        </form>
      </Form>
    </div>
  );
}