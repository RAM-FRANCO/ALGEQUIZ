import React, { Suspense } from "react";

import { Container } from "@/app/components/common/Container";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <Container className='h-screen flex flex-col justify-center items-center'>
      <Suspense>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
