import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

const routes:Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: () => import("./views/Login.vue")
    },
    {
      path: "/preview",
      name: "preview",
      component: () => import("./components/PreviewPdf.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("./views/Register.vue")
    },
    {
        path: "/index",
        component: () => import("./views/Index.vue"),


        children: [
            {
                path: "",
                components: {
                    head: () => import("./views/TopPage.vue"),
                    default: () => import("./views/BodyPage.vue")
                },
                children: [
                    {
                        path: "home",
                        name: "home",
                        component: () => import("./views/homePage.vue")
                    },
                    {
                        path: "FilePage",
                        name: 'FilePage',
                        component: () => import("./views/FileManager.vue")
                    },
                    {
                        path: "RecyclePage",
                        name: 'RecyclePage',
                        component: () => import("./views/RecyclePage.vue")
                    },
                    {
                        path: "share",
                        name: 'Share',
                        component: () => import("./views/MyShare.vue")
                    },
                    {
                        path: "receive",
                        name: 'Receive',
                        component: () => import("./views/ReceiveShare.vue")
                    },
                    {
                        path: "collection",
                        name: 'Collection',
                        component: () => import("./views/MyCollection.vue")
                    },
                    {
                        path: "FileSharing",
                        name: 'FileSharing',
                        component: () => import("./views/FileSharing.vue")
                    },
                    {
                        path: "search",
                        name: 'Search',
                        component: () => import("./views/Search.vue"),

                        children: [
                            {
                                path: "details",
                                name: 'Details',
                                component: () => import("./views/FileDetailsPage.vue")
                            },
                        ]
                    }
                ]
            }

        ]

    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const username = sessionStorage.getItem('username');

    if (to.path === '/register') {
        next();
    }
    if (to.path !== '/login' && !username) {
        next({ path: '/login' });
    } else {
        next();
    }
});

export default router;
