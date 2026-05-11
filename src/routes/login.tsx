import { Header } from '#/components/header'
import { isLoggedIn, login, loginSchema } from '#/db/server'
import { useForm, useStore } from '@tanstack/react-form-start'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await login({ data: value })
        window.location.reload()
        navigate({ to: '/' })
      } catch (error) {
        console.log(error)
      }
    },
  })

  useStore(form.store, (state: any) => state.values.email)
  useStore(form.store, (state: any) => state.values.password)

  return (
    <div className="min-h-screen container">
      <Header />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <div className="flex justify-between items-center">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Log In
            </h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <form.Field
                  name="email"
                  children={(f) => (
                    <>
                      <input
                        type="email"
                        value={f.state.value}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                        placeholder="Enter Email"
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </>
                  )}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="Content"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <form.Field
                  name="password"
                  children={(f) => (
                    <>
                      <input
                        type="password"
                        value={f.state.value}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                        placeholder="Enter Password"
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-teal-700 rounded-lg focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-900 hover:bg-teal-800"
            >
              Log in
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
