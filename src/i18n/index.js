import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      switchLang: 'Switch to Chinese',
      start: 'Start Learning',
      settings: 'Settings',
      history: 'History',
      review: 'Review',
      search: 'Search',
      add: 'Add',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      required: ' is required'
    },
    nav: {
      home: 'Home',
      decks: 'Decks',
      library: 'Library',
      difficult: 'Difficult',
      settings: 'Settings'
    },
    home: {
      title: 'Welcome to AIVoca',
      startLearning: 'Start Learning',
      continueStudy: 'Continue Study',
      todayProgress: 'Today\'s Progress',
      wordsLearned: 'Words Learned',
      wordsToReview: 'Words to Review',
      streak: 'Day Streak',
      browseDecks: 'Browse Decks',
      createYourOwn: 'Create Your Own',
      welcomeMessage: 'Learn Smarter, Not Harder',
      welcomeDescription: 'Experience the Future of Vocabulary Building: Faster, Easier, Smarter',
      recentlyStudied: 'Recently Studied',
      popularDecks: 'Popular Decks',
      viewAllDecks: 'View all decks',
      cardsReviewed: 'Cards reviewed',
      accuracy: 'Accuracy'
    },
    decks: {
      title: 'My Decks',
      createDeck: 'Create New Deck',
      importDeck: 'Import Deck',
      deckName: 'Deck Name',
      wordCount: 'Words',
      lastStudied: 'Last Studied',
      progress: 'Progress',
      actions: 'Actions',
      customDecks: 'Your Custom Decks',
      defaultDecks: 'Default Decks',
      noResults: 'No decks found matching your search.',
      defaultbeishigaozhong1: {
        name: 'BeiShiDa High School Book 1',
        description: 'Essential vocabulary from Beijing Normal University High School English Book 1'
      },
      defaultCET4_1: {
        name: 'CET4 Vocabulary',
        description: 'Essential vocabulary for the CET4 exam'
      },
      defaulttoefl: {
        name: 'TOEFL Essential Vocabulary',
        description: 'Common vocabulary words for the TOEFL exam'
      },
      defaultgre: {
        name: 'GRE Vocabulary',
        description: 'Essential vocabulary for GRE preparation'
      },
      defaultbusiness: {
        name: 'Business English',
        description: 'Essential vocabulary for business and professional settings'
      }
    },
    createDeck: {
      title: 'Create New Deck',
      deckName: 'Deck Name',
      description: 'Description',
      category: 'Category',
      difficulty: 'Difficulty',
      addWords: 'Add Words',
      word: 'Word',
      meaning: 'Meaning',
      example: 'Example',
      pronunciation: 'Pronunciation',
      importFromFile: 'Import from File',
      createDeck: 'Create Deck',
      deckInfo: 'Deck Information'
    },
    study: {
      title: 'Study Session',
      progress: 'Progress',
      showAnswer: 'Show Answer',
      nextWord: 'Next Word',
      finishSession: 'Finish Session',
      knowIt: 'I Know It',
      stillLearning: 'Still Learning',
      difficult: 'Difficult',
      example: 'Example',
      pronunciation: 'Pronunciation',
      clickToSee: 'Click to see the definition',
      easy: 'Easy',
      ukPron: 'UK',
      usPron: 'US'
    },
    settings: {
      title: 'Settings',
      dailyGoal: 'Daily Goal',
      wordsPerDay: 'words per day',
      darkMode: 'Dark Mode',
      notifications: 'Notifications',
      sound: 'Sound Effects',
      pronunciation: 'Auto-play Pronunciation',
      language: 'Language',
      about: 'About',
      version: 'Version'
    },
    library: {
      title: 'Word Library',
      allWords: 'All Words',
      learned: 'Learned',
      learning: 'Learning',
      difficult: 'Difficult',
      search: 'Search Words',
      filter: 'Filter',
      sort: 'Sort By',
      emptyTitle: 'Your library is empty',
      emptyDescription: 'Create your first custom vocabulary deck to get started.'
    },
    difficultWords: {
      title: 'Difficult Words',
      reviewAll: 'Review All',
      word: 'Word',
      meaning: 'Meaning',
      lastReviewed: 'Last Reviewed',
      status: 'Status',
      actions: 'Actions',
      search: 'Search difficult words',
      from: 'From:',
      emptyTitle: 'No difficult words yet',
      emptyDescription: 'Words you mark as difficult during study sessions will appear here for focused review.',
      browseDecks: 'Browse Study Decks'
    },
    deckDetail: {
      title: 'Deck Details',
      startStudy: 'Start Study',
      editDeck: 'Edit Deck',
      deleteDeck: 'Delete Deck',
      statistics: 'Statistics',
      wordList: 'Word List',
      progress: 'Progress',
      mastered: 'Mastered',
      learning: 'Learning',
      notStarted: 'Not Started'
    }
  },
  zh: {
    common: {
      switchLang: '切换为英文',
      start: '开始学习',
      settings: '设置',
      history: '历史记录',
      review: '复习',
      search: '搜索',
      add: '添加',
      delete: '删除',
      edit: '编辑',
      save: '保存',
      cancel: '取消',
      required: '是必填项'
    },
    nav: {
      home: '首页',
      decks: '单词本',
      library: '词库',
      difficult: '难词',
      settings: '设置'
    },
    home: {
      title: '欢迎使用 AIVoca',
      startLearning: '开始学习',
      continueStudy: '继续学习',
      todayProgress: '今日进度',
      wordsLearned: '已学单词',
      wordsToReview: '待复习',
      streak: '连续学习天数',
      browseDecks: '浏览单词本',
      createYourOwn: '创建新单词本',
      welcomeMessage: '聪明地学习，而不是辛苦地学习',
      welcomeDescription: '体验词汇构建的未来：更快、更轻松、更智能',
      recentlyStudied: '最近学习',
      popularDecks: '热门单词本',
      viewAllDecks: '查看全部',
      cardsReviewed: '已复习卡片',
      accuracy: '正确率'
    },
    decks: {
      title: '我的单词本',
      createDeck: '创建新单词本',
      importDeck: '导入单词本',
      deckName: '单词本名称',
      wordCount: '单词数量',
      lastStudied: '上次学习',
      progress: '进度',
      actions: '操作',
      customDecks: '自定义单词本',
      defaultDecks: '默认单词本',
      noResults: '未找到匹配的单词本',
      defaultbeishigaozhong1: {
        name: '北师大高中必修一',
        description: '北师大版高中英语必修一词汇'
      },
      defaultCET4_1: {
        name: '四级核心词汇',
        description: '四级考试常用词汇'
      },
      defaulttoefl: {
        name: 'TOEFL 核心词汇',
        description: 'TOEFL 考试常用词汇'
      },
      defaultgre: {
        name: 'GRE 词汇',
        description: 'GRE 备考必备词汇'
      },
      defaultbusiness: {
        name: '商务英语',
        description: '商务和职场必备英语词汇'
      }
    },
    createDeck: {
      title: '创建新单词本',
      deckName: '单词本名称',
      description: '描述',
      category: '分类',
      difficulty: '难度',
      addWords: '添加单词',
      word: '单词',
      meaning: '含义',
      example: '例句',
      pronunciation: '发音',
      importFromFile: '从文件导入',
      createDeck: '创建单词本',
      deckInfo: '单词本信息'
    },
    study: {
      title: '学习课程',
      progress: '进度',
      showAnswer: '显示答案',
      nextWord: '下一个',
      finishSession: '完成学习',
      knowIt: '我已掌握',
      stillLearning: '继续学习',
      difficult: '困难',
      example: '例句',
      pronunciation: '发音',
      clickToSee: '点击查看释义',
      easy: '简单',
      ukPron: '英音',
      usPron: '美音',
      examples: '例句',
      phrases: '短语',
      memoryTip: '记忆提示'
    },
    settings: {
      title: '设置',
      dailyGoal: '每日目标',
      wordsPerDay: '个单词/天',
      darkMode: '深色模式',
      notifications: '通知提醒',
      sound: '音效',
      pronunciation: '自动播放发音',
      language: '语言',
      about: '关于',
      version: '版本'
    },
    library: {
      title: '词库',
      allWords: '所有单词',
      learned: '已掌握',
      learning: '学习中',
      difficult: '困难词',
      search: '搜索单词',
      filter: '筛选',
      sort: '排序',
      emptyTitle: '词库为空',
      emptyDescription: '创建你的第一个自定义词库开始学习吧'
    },
    difficultWords: {
      title: '困难词',
      reviewAll: '全部复习',
      word: '单词',
      meaning: '含义',
      lastReviewed: '上次复习',
      status: '状态',
      actions: '操作',
      search: '搜索困难词',
      from: '来自：',
      emptyTitle: '暂无困难词',
      emptyDescription: '在学习过程中标记为困难的单词会出现在这里，方便集中复习。',
      browseDecks: '浏览学习单词本'
    },
    deckDetail: {
      title: '单词本详情',
      startStudy: '开始学习',
      editDeck: '编辑单词本',
      deleteDeck: '删除单词本',
      statistics: '统计信息',
      wordList: '单词列表',
      progress: '进度',
      mastered: '已掌握',
      learning: '学习中',
      notStarted: '未开始'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages
}) 