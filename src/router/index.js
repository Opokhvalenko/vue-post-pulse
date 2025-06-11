import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/components/Login.vue';
import MainContent from '@/components/MainContent.vue';
import PostsList from '@/components/PostsList.vue';
import PostDetails from '@/components/PostDetails.vue';
import AddPost from '@/components/AddPost.vue';
import NotFoundComponent from '@/components/NotFound.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: MainContent,
    children: [
      {
        path: 'posts',
        name: 'PostsList',
        component: PostsList,
      },
      {
        path: 'posts/create',
        name: 'AddPost',
        component: AddPost,
      },
      {
        path: 'posts/:id',
        name: 'PostDetails',
        component: PostDetails,
        props: true,
      },
      {
        path: 'posts/:id/edit',
        name: 'UpdatingPost',
        component: AddPost,
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundComponent,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');

  if (!user && to.name !== 'Login') {
    next({ name: 'Login' });
  } else if (user && to.name === 'Login') {
    next({ name: 'PostsList' });
  } else {
    next();
  }
});

export default router;
