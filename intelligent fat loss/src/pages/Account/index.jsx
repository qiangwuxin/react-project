import useTitle from '@/hooks/useTitle'
import {
    useState,
    useRef
} from 'react';
import {
    Image,
    Cell,
    CellGroup,
    ActionSheet,
    Popup,
    Loading
} from 'react-vant'
import {
    ServiceO,
    FriendsO,
    StarO,
    SettingO,
    UserCircleO,
    AddO,
    CartO,
    ChatO,
    FireO,
    LikeO,
    Search,
    HomeO,
    UserO
} from '@react-vant/icons'
import {
    generateAvatar
} from '@/llm'
import styles from './account.module.css';

const Account = () => {
    const fileInputRef = useRef(null);

    const uploadImgData = (e) => {
        //  html5的文件上传功能
        //可选链操作符？.
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        //    console.log(file);
        //图片预览  I/O操作 异步 
        return new Promise((resolve, reject) => {
            //html5
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                // console.log(reader.result);
                //响应式业务
                setUserInfo({ ...userInfo, avatar: reader.result });
                resolve(reader.result);
            }
            reader.onerror = (error) => { reject(error); };
        })
    }

    const gridData = [
        { icon: <AddO />, text: '添加' },
        { icon: <CartO />, text: '购物车' },
        { icon: <ChatO />, text: '聊天' },
        { icon: <FireO />, text: '热门' },
        { icon: <LikeO />, text: '喜欢' },
        { icon: <StarO />, text: '收藏' },
        { icon: <Search />, text: '搜索' },
        { icon: <HomeO />, text: '首页' },
        { icon: <UserO />, text: '我的' }
    ];

    const [userInfo, setUserInfo] = useState({
        nickname: '小猫',
        level: '5级',
        slogan: '保持热爱，奔赴山海。',
        avatar: 'https://www.shuomingshu.cn/wp-content/uploads/images/2023/03/12/RZvQpXSBzZ9TXi_gy3r1n1r0r2.jpg'
    })
    useTitle("我的")
    const [showActionSheet, setShowActionSheet] = useState(false);
    const handleAction = async (e) => {
        console.log(e);
        if (e.type === 1) {
            //AI生成头像
            const text = `
          昵称：${userInfo.nickname}
          slogan:${userInfo.slogan}
          `
            const newAvatar = await generateAvatar(text);
            setUserInfo({ ...userInfo, avatar: newAvatar });
        } else if (e.type === 2) {
            //图片上传
            fileInputRef.current?.click();
        }
    }

    const actions = [
        {
            name: 'AI生成头像',
            color: '#123123',
            type: 1
        },
        {
            name: '上传头像',
            color: '#ee0a24',
            type: 2
        }
    ]
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <Image
                    round
                    width="64px"
                    height="64px"
                    src={userInfo.avatar}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowActionSheet(true)}
                />
                <div className="ml4">
                    <div className={styles.nickname}>昵称：{userInfo.nickname}</div>
                    <div className={styles.level}>等级：{userInfo.level}</div>
                    <div className={styles.slogan}>签名：{userInfo.slogan}</div>
                </div>
            </div>
            <div className="mt3">
                <CellGroup inset>
                    <Cell title="服务" icon={<ServiceO />} isLink />
                </CellGroup>
                <CellGroup inset className="mt2">
                    <Cell title="收藏" icon={<StarO />} isLink />
                    <Cell title="朋友圈" icon={<FriendsO />} isLink />
                </CellGroup>

                <CellGroup inset className="mt2">
                    <Cell title="设置" icon={<SettingO />} isLink />
                </CellGroup>
            </div>
            <ActionSheet
                visible={showActionSheet}
                actions={actions}
                cancelText='取消'
                onCancel={() => { setShowActionSheet(false) }}
                onSelect={(e) => handleAction(e)}
            />

            {/* 隱藏的文件輸入 */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={uploadImgData}
            />
            <div className={styles.gridContainer}>
                {
                    gridData.map((item, index) => (
                        <div key={index} className={styles.gridItem}>
                            <div className={styles.icon}>{item.icon}</div>
                            <div className={styles.text}>{item.text}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default Account