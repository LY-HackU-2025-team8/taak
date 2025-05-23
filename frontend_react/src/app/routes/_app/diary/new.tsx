import {
  NewDiaryForm,
  newDiaryFormSchema,
} from '@/pages/diary/ui/new-diary-form';
import { $api } from '@/shared/api/openapi-fetch';
import { CloseIcon } from '@/shared/ui/components/icons/close-icon';
import { Button } from '@/shared/ui/components/shadcn/button';
import { Form } from '@/shared/ui/components/shadcn/form';
import { PageHeader } from '@/shared/ui/page/page-header';
import { PageMain } from '@/shared/ui/page/page-main';
import { PageSection } from '@/shared/ui/page/page-section';
import { PageTitleContainer } from '@/shared/ui/page/page-title-container';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const Route = createFileRoute('/_app/diary/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = $api.useMutation('post', '/diaries');

  const form = useForm({
    resolver: zodResolver(newDiaryFormSchema),
    defaultValues: {
      title: '',
      body: '',
      date: new Date(),
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleSubmit = form.handleSubmit((data) => {
    mutate(
      {
        body: {
          ...data,
          date: format(data.date, 'yyyy-MM-dd'),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          navigate({
            to: '/diary',
          });
        },
      }
    );
  });

  const date = form.watch('date');

  return (
    <div className="flex h-full flex-col">
      <PageHeader>
        <PageTitleContainer>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/diary">
              <CloseIcon />
            </Link>
          </Button>
        </PageTitleContainer>
      </PageHeader>
      <PageMain className="flex flex-1 flex-col gap-7">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="contents">
            <PageSection className="flex-1">
              <div className="flex flex-col items-start gap-2">
                <span className="block text-3xl font-bold">
                  {format(date, 'M月dd日')}
                </span>
                <span className="block text-3xl font-bold">
                  {format(date, 'EEEE', { locale: ja })}
                </span>
              </div>
              <NewDiaryForm />
            </PageSection>
            <PageSection className="mt-auto" asChild>
              <footer>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link to="/diary">キャンセル</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    保存
                  </Button>
                </div>
                {error && (
                  <div className="text-destructive">
                    {error.message || 'エラーが発生しました。'}
                  </div>
                )}
              </footer>
            </PageSection>
          </form>
        </Form>
      </PageMain>
    </div>
  );
}
