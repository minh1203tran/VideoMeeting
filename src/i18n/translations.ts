export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Navigation
    nav: {
      features: 'Features',
      ready: 'Ready?',
      about: 'About',
      login: 'Log in',
      getAssistant: 'Get Assistant',
      dashboard: 'Dashboard',
      myMeetings: 'My Meetings',
      recordings: 'Recordings',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout'
    },
    
    // Home Page
    hero: {
      badge: 'AI Agent 2.0 is live',
      title1: 'Your Second',
      title2: 'Brain for',
      title3: 'Meetings.',
      subtitle: 'The AI assistant that records, transcribes, and turns your conversations into organized action items. Don\'t just meet—flow.',
      tryDemo: 'Try Free Demo',
      watchWorkflow: 'Watch Workflow',
      lovedBy: 'Loved by product teams',
      recording: 'Recording...'
    },
    
    features: {
      title: 'Your Automated Chief of Staff',
      subtitle: 'Meeting Assistant handles the boring administrative work so your team can focus on execution.',
      transcription: {
        title: 'Real-time Transcription',
        desc: 'Identify speakers instantly. Handles jargon and 30+ languages with 99% accuracy.'
      },
      actionItems: {
        title: 'Instant Action Items',
        desc: 'AI detects promises and tasks automatically.'
      },
      sync: {
        title: 'Universal Sync',
        desc: 'Works where you work.'
      },
      cta: {
        title: 'Ready to reclaim your time?',
        join: 'Join 10,000+ others',
        button: 'Start Free Trial'
      }
    },
    
    ready: {
      title1: 'Are you ready',
      title2: 'to master your',
      title3: 'next meeting?',
      subtitle: 'Join thousands of professionals using Meeting Assistant to build confidence and streamline workflows today.',
      button: 'Get Started Now'
    },
    
    footer: {
      description: 'Empowering teams to focus on what matters by automating the post-meeting workflow. Join the productivity revolution today.',
      product: 'Product',
      company: 'Company',
      legal: 'Legal',
      copyright: '© 2024 Meeting Assistant Inc. All rights reserved.',
      pricing: 'Pricing',
      integrations: 'Integrations',
      changelog: 'Changelog',
      aboutUs: 'About Us',
      careers: 'Careers',
      blog: 'Blog',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      security: 'Security'
    },
    
    // Login Page
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue to Meeting Assistant',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      noAccount: 'Don\'t have an account?',
      signUp: 'Sign up',
      or: 'Or continue with',
      google: 'Google',
      microsoft: 'Microsoft',
      terms: 'By continuing, you agree to our',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      connectionError: 'Connection Error',
      configurationError: 'Configuration Error',
      connectionErrorMsg: 'Cannot connect to the authentication server. Please try again later.',
      configErrorMsg: 'Server login URL not configured. Please add `VITE_API_URL` to your `.env` file.'
    },
    
    // Dashboard Page
    dashboard: {
      welcome: 'Welcome back',
      overview: 'Overview',
      stats: {
        totalMeetings: 'Total Meetings',
        thisWeek: 'This Week',
        actionItems: 'Action Items',
        pending: 'Pending',
        recordingTime: 'Recording Time',
        hours: 'hours',
        aiScore: 'AI Score',
        average: 'Average'
      },
      upcomingMeetings: 'Upcoming Meetings',
      upcomingToday: 'Upcoming Today',
      recentMeetings: 'Recent Meetings 123',
      actionItems: 'Action Items',
      viewAll: 'View All',
      startMeeting: 'Start New Meeting',
      scheduleMeeting: 'Schedule Meeting',
      noMeetings: 'No upcoming meetings',
      noRecentMeetings: 'No recent meetings',
      quickActions: 'Quick Actions',
      analytics: 'Analytics',
      proTip: 'Pro Tip',
      viewReport: 'View Full Report',
      viewFullCalendar: 'View Full Calendar',
      viewMeetingsToday: 'View Meetings Today',
      viewRecentMeetings: 'View Recent Meetings',
      speakingTime: 'Speaking Time',
      meetingActivity: 'Meeting Activity',
      last30Days: 'Last 30 days',

      allMeetings: 'All Meetings',
      meetingTitle: 'Meeting Title',
      dateTime: 'Date & Time',
      status: 'Status',
      participantCount: 'Number of Participants',
      maxParticipantsLabel: 'Max:',
      people: 'people',
      aiSummary: 'AI Summary',
      actions: 'Actions',
      host: 'Host',
      ready: 'Ready',
      processing: 'Processing',
      done: 'Done',
      analyzing: 'Analyzing',
      participationScore: 'Participation Score',
      recorded: 'Recorded',
      summarized: 'Summarized'
    },
    
    // My Meetings Page
    myMeetings: {
      title: 'My Meetings',
      subtitle: 'Manage your schedule and upcoming syncs.',
      filters: {
        all: 'All',
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled'
      },
      search: 'Search meetings...',
      newMeeting: 'Schedule Meeting',
      duration: 'Duration',
      participants: 'Participants',
      status: 'Status',
      actions: 'Actions',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      noMeetings: 'No meetings found',
      today: 'Today',
      pastMeetings: 'Past Meetings',
      stats: 'Meeting Stats',
      totalWeek: 'Total this week',
      hoursSpent: 'Hours spent',
      uniquePeople: 'Unique People',
      calendarTip: 'Connect your Google Calendar to automatically record every meeting.'
    },
    
    // Recordings Page
    recordings: {
      title: 'Recordings Library',
      subtitle: 'Access transcripts, video, and AI summaries.',
      search: 'Search recordings...',
      searchPlaceholder: 'Search transcript...',
      sortBy: 'Sort by',
      date: 'Date',
      duration: 'Duration',
      size: 'Size',
      download: 'Download',
      play: 'Play',
      transcript: 'View Transcript',
      delete: 'Delete',
      noRecordings: 'No recordings available',
      upload: 'Upload Recording',
      fileTypes: 'MP4, MOV, or Audio files'
    },
    
    // Reports Page
    reports: {
      title: 'Analytics & Reports',
      subtitle: 'Deep dive into your meeting productivity.',
      last30Days: 'Last 30 Days',
      exportPDF: 'Export PDF',
      recentReports: 'Recent Meeting Reports',
      date: 'Date',
      meetingTitle: 'Meeting Title',
      participants: 'Participants',
      actions: 'Actions',
      viewRecording: 'View Recording',
      pdf: 'PDF',
      totalHours: 'Total Meeting Hours',
      avgCost: 'Avg. Meeting Cost',
      tasksCompleted: 'Tasks Completed',
      frequencyTrend: 'Meeting Frequency Trend',
      speakingDistribution: 'Speaking Distribution',
      participationScore: 'Weekly Participation Score',
      insightTitle: 'Insight of the Month',
      insightText: 'Your most productive meetings happen on Tuesday mornings between 9 AM and 11 AM.',
      topKeyword: 'Top Keyword',
      viewInsights: 'View Full Insights',
      period: {
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year'
      },
      metrics: {
        totalMeetings: 'Total Meetings',
        avgDuration: 'Avg Duration',
        totalParticipants: 'Total Participants',
        completionRate: 'Completion Rate'
      },
      charts: {
        meetingTrends: 'Meeting Trends',
        participantActivity: 'Participant Activity',
        topicsDiscussed: 'Topics Discussed'
      },
      export: 'Export Report',
      download: 'Download PDF'
    },
    
    // Settings Page
    settings: {
      title: 'Settings',
      subtitle: 'Manage your profile, notifications, and integrations.',
      profile: 'Profile',
      integrations: 'Integrations',
      notifications: 'Notifications',
      privacy: 'Privacy & Security',
      profileInfo: 'Profile Information',
      changeAvatar: 'Change Avatar',
      avatarHint: 'JPG, GIF or PNG. Max size 800K',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      bio: 'Bio',
      bioPlaceholder: 'Tell us a little about yourself...',
      clickupDesc: 'Sync meeting action items directly to your tasks.',
      connectClickUp: 'Connect ClickUp',
      preferences: 'Preferences',
      autoJoin: 'Auto-join Meetings',
      autoJoinDesc: 'Automatically have the assistant join calendar events.',
      emailSummaries: 'Email Summaries',
      emailSummariesDesc: 'Receive a recap email after every meeting.',
      password: 'Password',
      passwordDesc: 'Change your password to secure your account',
      twoFactor: 'Two-Factor Authentication',
      twoFactorDesc: 'Protect your account with two-factor authentication',
      activeSessions: 'Active Sessions',
      activeSessionsDesc: 'Manage your active sessions'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      download: 'Download',
      upload: 'Upload',
      select: 'Select',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      noData: 'No data available',
      error: 'An error occurred',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      sync: 'Sync Calendar',
      join: 'Join',
      watch: 'Watch',
      proTip: 'Pro Tip',
      connectCalendar: 'Connect Calendar',
      saveChanges: 'Save Changes',
      remove: 'Remove',
      you: 'You',
      inMeeting: 'In Meeting',
      addPeople: 'Add People',
      sendMessage: 'Send a message...',
      copied: 'Copied to clipboard!',
      logoutTitle: 'Are you sure you want to logout?',
      logoutMessage: 'You will be logged out of your account.'
    },

    // Meeting Controls
    meeting: {
      muteAudio: 'Mute',
      unmuteAudio: 'Unmute',
      turnOffCamera: 'Turn off camera',
      turnOnCamera: 'Turn on camera',
      shareScreen: 'Share screen',
      stopSharing: 'Stop sharing',
      reactions: 'Reactions',
      moreOptions: 'More options',
      leaveMeeting: 'Leave meeting',
      meetingInfo: 'Meeting Info',
      chat: 'Chat',
      participants: 'Participants',
      startRecording: 'Start recording',
      stopRecording: 'Stop recording'
    },

    // Create Meeting Modal
    createMeeting: {
      instantTitle: 'Start Instant Meeting',
      scheduleTitle: 'Schedule Meeting',
      roomName: 'Room Name',
      roomNamePlaceholder: 'e.g., Q3 Planning, Design Sync...',
      description: 'Description',
      descriptionPlaceholder: 'What is this meeting about?',
      accessType: 'Access Type',
      public: 'Public',
      private: 'Private',
      maxParticipants: 'Max Participants',
      schedule: 'Schedule',
      startDate: 'Start Date',
      startTime: 'Start Time',
      endDate: 'End Date',
      endTime: 'End Time',
      startMeetingNow: 'Start Meeting Now',
      scheduleMeetingBtn: 'Schedule Meeting'
    },

    // Error Messages
    errors: {
      authenticationError: 'Authentication Error',
      configurationError: 'Configuration Error',
      permissionDenied: 'Permission Denied',
      roomAlreadyExists: 'Room Already Exists',
      tooManyRequests: 'Too Many Requests',
      serverError: 'Server Error',
      connectionError: 'Connection Error',
      unexpectedError: 'Unexpected Error',
      sessionExpired: 'Your session has expired. Please log in again.',
      apiNotConfigured: 'API URL is not configured. Please contact support.',
      invalidMeetingInfo: 'Invalid meeting information. Please check your input.',
      noPermission: 'You do not have permission to create a room.',
      roomExists: 'A room with this configuration already exists.',
      tooQuickly: 'You are creating rooms too quickly. Please wait and try again.',
      serverIssues: 'The server is experiencing issues. Please try again later.',
      connectionFailed: 'Unable to connect to the server. Please check your internet connection.',
      unknownError: 'An unexpected error occurred. Please try again.'
    }
  },
  
  vi: {
    // Navigation
    nav: {
      features: 'Tính năng',
      ready: 'Sẵn sàng?',
      about: 'Giới thiệu',
      login: 'Đăng nhập',
      getAssistant: 'Dùng thử ngay',
      dashboard: 'Tổng quan',
      myMeetings: 'Cuộc họp của tôi',
      recordings: 'Ghi âm',
      reports: 'Báo cáo',
      settings: 'Cài đặt',
      logout: 'Đăng xuất'
    },
    
    // Home Page
    hero: {
      badge: 'AI Agent 2.0 đã ra mắt',
      title1: 'Trợ lý thông minh',
      title2: 'cho mọi',
      title3: 'Cuộc họp.',
      subtitle: 'Trợ lý AI ghi âm, chuyển đổi giọng nói và tổ chức công việc tự động. Không chỉ họp—mà còn hiệu quả.',
      tryDemo: 'Dùng thử miễn phí',
      watchWorkflow: 'Xem demo',
      lovedBy: 'Được yêu thích bởi các đội nhóm',
      recording: 'Đang ghi âm...'
    },
    
    features: {
      title: 'Trợ lý tự động của bạn',
      subtitle: 'Meeting Assistant xử lý công việc hành chính nhàm chán để đội nhóm của bạn tập trung vào thực thi.',
      transcription: {
        title: 'Chuyển đổi giọng nói thời gian thực',
        desc: 'Nhận diện người nói ngay lập tức. Xử lý thuật ngữ và hơn 30 ngôn ngữ với độ chính xác 99%.'
      },
      actionItems: {
        title: 'Tạo công việc tức thì',
        desc: 'AI tự động phát hiện lời hứa và nhiệm vụ.'
      },
      sync: {
        title: 'Đồng bộ toàn diện',
        desc: 'Hoạt động mọi nơi bạn làm việc.'
      },
      cta: {
        title: 'Sẵn sàng lấy lại thời gian?',
        join: 'Tham gia cùng 10,000+ người khác',
        button: 'Dùng thử miễn phí'
      }
    },
    
    ready: {
      title1: 'Bạn đã sẵn sàng',
      title2: 'làm chủ cuộc họp',
      title3: 'tiếp theo chưa?',
      subtitle: 'Tham gia cùng hàng nghìn chuyên gia đang sử dụng Meeting Assistant để tự tin và tối ưu quy trình làm việc.',
      button: 'Bắt đầu ngay'
    },
    
    footer: {
      description: 'Trao quyền cho các đội nhóm tập trung vào những gì quan trọng bằng cách tự động hóa quy trình sau cuộc họp. Tham gia cuộc cách mạng năng suất ngay hôm nay.',
      product: 'Sản phẩm',
      company: 'Công ty',
      legal: 'Pháp lý',
      copyright: '© 2024 Meeting Assistant Inc. Bản quyền đã được bảo hộ.',
      pricing: 'Bảng giá',
      integrations: 'Tích hợp',
      changelog: 'Nhật ký thay đổi',
      aboutUs: 'Về chúng tôi',
      careers: 'Tuyển dụng',
      blog: 'Blog',
      contact: 'Liên hệ',
      privacy: 'Bảo mật',
      terms: 'Điều khoản',
      security: 'Bảo mật'
    },
    
    // Login Page
    login: {
      title: 'Chào mừng trở lại',
      subtitle: 'Đăng nhập để tiếp tục sử dụng Meeting Assistant',
      email: 'Email',
      password: 'Mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      signIn: 'Đăng nhập',
      noAccount: 'Chưa có tài khoản?',
      signUp: 'Đăng ký',
      or: 'Hoặc tiếp tục với',
      google: 'Google',
      microsoft: 'Microsoft',
      terms: 'Bằng việc tiếp tục, bạn đồng ý với',
      termsOfService: 'Điều khoản dịch vụ',
      and: 'và',
      privacyPolicy: 'Chính sách bảo mật',
      connectionError: 'Lỗi kết nối',
      configurationError: 'Lỗi cấu hình',
      connectionErrorMsg: 'Không thể kết nối với máy chủ xác thực. Vui lòng thử lại sau.',
      configErrorMsg: 'URL đăng nhập máy chủ chưa được cấu hình. Vui lòng thêm `VITE_API_URL` vào tệp `.env` của bạn.'
    },
    
    // Dashboard Page
    dashboard: {
      welcome: 'Chào mừng trở lại',
      overview: 'Tổng quan',
      stats: {
        totalMeetings: 'Tổng số cuộc họp',
        thisWeek: 'Tuần này',
        actionItems: 'Công việc',
        pending: 'Đang chờ',
        recordingTime: 'Thời gian ghi âm',
        hours: 'giờ',
        aiScore: 'Điểm AI',
        average: 'Trung bình'
      },
      upcomingMeetings: 'Cuộc họp sắp tới',
      upcomingToday: 'Cuộc họp hôm nay',
      recentMeetings: 'Cuộc họp gần đây',
      actionItems: 'Công việc cần làm',
      viewAll: 'Xem tất cả',
      startMeeting: 'Bắt đầu cuộc họp mới',
      scheduleMeeting: 'Lên lịch cuộc họp',
      noMeetings: 'Không có cuộc họp sắp tới',
      noRecentMeetings: 'Không có cuộc họp gần đây',
      quickActions: 'Thao tác nhanh',
      analytics: 'Phân tích',
      proTip: 'Mẹo hữu ích',
      viewReport: 'Xem báo cáo đầy đủ',
      viewFullCalendar: 'Xem lịch đầy đủ',
      viewMeetingsToday: 'Xem cuộc họp hôm nay',
      viewRecentMeetings: 'Xem cuộc họp gần nhất',
      speakingTime: 'Thời gian phát biểu',
      meetingActivity: 'Hoạt động cuộc họp',
      last30Days: '30 ngày qua',
      allMeetings: 'Tất cả cuộc họp',
      meetingTitle: 'Tên cuộc họp',
      dateTime: 'Ngày & Giờ',
      status: 'Trạng thái',
      participantCount: 'Số người tham gia',
      maxParticipantsLabel: 'Tối đa:',
      people: 'người',
      aiSummary: 'Tóm tắt AI',
      actions: 'Hành động',
      host: 'Chủ trì',
      ready: 'Sẵn sàng',
      processing: 'Đang xử lý',
      done: 'Hoàn thành',
      analyzing: 'Đang phân tích',
      participationScore: 'Điểm tham gia',
      recorded: 'Đã ghi âm',
      summarized: 'Đã tóm tắt'
    },
    
    // My Meetings Page
    myMeetings: {
      title: 'Cuộc họp của tôi',
      subtitle: 'Quản lý lịch trình và các cuộc họp sắp tới.',
      filters: {
        all: 'Tất cả',
        upcoming: 'Sắp diễn ra',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy'
      },
      search: 'Tìm kiếm cuộc họp...',
      newMeeting: 'Lên lịch cuộc họp',
      duration: 'Thời lượng',
      participants: 'Người tham gia',
      status: 'Trạng thái',
      actions: 'Hành động',
      view: 'Xem',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      noMeetings: 'Không tìm thấy cuộc họp',
      today: 'Hôm nay',
      pastMeetings: 'Cuộc họp đã qua',
      stats: 'Thống kê cuộc họp',
      totalWeek: 'Tổng tuần này',
      hoursSpent: 'Giờ đã dùng',
      uniquePeople: 'Người tham gia',
      calendarTip: 'Kết nối Google Calendar để tự động ghi âm mọi cuộc họp.'
    },
    
    // Recordings Page
    recordings: {
      title: 'Thư viện ghi âm',
      subtitle: 'Truy cập bản ghi, video và tóm tắt AI.',
      search: 'Tìm kiếm bản ghi...',
      searchPlaceholder: 'Tìm kiếm bản ghi...',
      sortBy: 'Sắp xếp theo',
      date: 'Ngày',
      duration: 'Thời lượng',
      size: 'Kích thước',
      download: 'Tải xuống',
      play: 'Phát',
      transcript: 'Xem bản ghi',
      delete: 'Xóa',
      noRecordings: 'Không có bản ghi âm nào',
      upload: 'Tải lên ghi âm',
      fileTypes: 'Tệp MP4, MOV hoặc Audio'
    },
    
    // Reports Page
    reports: {
      title: 'Phân tích & Báo cáo',
      subtitle: 'Phân tích sâu về hiệu suất cuộc họp.',
      last30Days: '30 ngày qua',
      exportPDF: 'Xuất PDF',
      recentReports: 'Báo cáo cuộc họp gần đây',
      date: 'Ngày',
      meetingTitle: 'Tiêu đề cuộc họp',
      participants: 'Người tham gia',
      actions: 'Hành động',
      viewRecording: 'Xem ghi âm',
      pdf: 'PDF',
      totalHours: 'Tổng giờ họp',
      avgCost: 'Chi phí TB cuộc họp',
      tasksCompleted: 'Công việc hoàn thành',
      frequencyTrend: 'Xu hướng tần suất cuộc họp',
      speakingDistribution: 'Phân bổ thời gian phát biểu',
      participationScore: 'Điểm tham gia hàng tuần',
      insightTitle: 'Thông tin chi tiết trong tháng',
      insightText: 'Các cuộc họp hiệu quả nhất của bạn diễn ra vào sáng thứ Ba từ 9 giờ đến 11 giờ sáng.',
      topKeyword: 'Từ khóa hàng đầu',
      viewInsights: 'Xem toàn bộ thông tin',
      period: {
        week: 'Tuần này',
        month: 'Tháng này',
        quarter: 'Quý này',
        year: 'Năm nay'
      },
      metrics: {
        totalMeetings: 'Tổng số cuộc họp',
        avgDuration: 'Thời lượng TB',
        totalParticipants: 'Tổng người tham gia',
        completionRate: 'Tỷ lệ hoàn thành'
      },
      charts: {
        meetingTrends: 'Xu hướng cuộc họp',
        participantActivity: 'Hoạt động người tham gia',
        topicsDiscussed: 'Chủ đề thảo luận'
      },
      export: 'Xuất báo cáo',
      download: 'Tải PDF'
    },
    
    // Settings Page
    settings: {
      title: 'Cài đặt',
      subtitle: 'Quản lý hồ sơ, thông báo và tích hợp.',
      profile: 'Hồ sơ',
      integrations: 'Tích hợp',
      notifications: 'Thông báo',
      privacy: 'Bảo mật & Quyền riêng tư',
      profileInfo: 'Thông tin hồ sơ',
      changeAvatar: 'Đổi ảnh đại diện',
      avatarHint: 'JPG, GIF hoặc PNG. Tối đa 800K',
      fullName: 'Họ và tên',
      emailAddress: 'Địa chỉ Email',
      bio: 'Tiểu sử',
      bioPlaceholder: 'Hãy nói một chút về bản thân bạn...',
      clickupDesc: 'Đồng bộ công việc từ cuộc họp trực tiếp vào nhiệm vụ của bạn.',
      connectClickUp: 'Kết nối ClickUp',
      preferences: 'Tùy chọn',
      autoJoin: 'Tự động tham gia cuộc họp',
      autoJoinDesc: 'Tự động cho trợ lý tham gia các sự kiện trên lịch.',
      emailSummaries: 'Tóm tắt Email',
      emailSummariesDesc: 'Nhận email tóm tắt sau mỗi cuộc họp.',
      password: 'Mật khẩu',
      passwordDesc: 'Thay đổi mật khẩu của bạn để bảo vệ tài khoản',
      twoFactor: 'Xác thực hai yếu tố',
      twoFactorDesc: 'Bảo vệ tài khoản bằng xác thực hai yếu tố',
      activeSessions: 'Phiên hoạt động',
      activeSessionsDesc: 'Quản lý các phiên hoạt động của bạn'
    },
    
    // Common
    common: {
      loading: 'Đang tải...',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      view: 'Xem',
      close: 'Đóng',
      confirm: 'Xác nhận',
      back: 'Quay lại',
      next: 'Tiếp theo',
      previous: 'Trước',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      export: 'Xuất',
      download: 'Tải xuống',
      upload: 'Tải lên',
      select: 'Chọn',
      selectAll: 'Chọn tất cả',
      deselectAll: 'Bỏ chọn tất cả',
      noData: 'Không có dữ liệu',
      error: 'Đã xảy ra lỗi',
      success: 'Thành công',
      warning: 'Cảnh báo',
      info: 'Thông tin',
      sync: 'Đồng bộ lịch',
      join: 'Tham gia',
      watch: 'Xem',
      proTip: 'Mẹo hữu ích',
      connectCalendar: 'Kết nối lịch',
      saveChanges: 'Lưu thay đổi',
      remove: 'Xóa',
      you: 'Bạn',
      inMeeting: 'Trong cuộc họp',
      addPeople: 'Thêm người',
      sendMessage: 'Gửi tin nhắn...',
      copied: 'Đã copy vào clipboard!',
      logoutTitle: 'Bạn có chắc muốn đăng xuất không?',
      logoutMessage: 'Bạn sẽ được đăng xuất khỏi tài khoản của mình.'
    },

    // Meeting Controls
    meeting: {
      muteAudio: 'Tắt âm',
      unmuteAudio: 'Bật âm',
      turnOffCamera: 'Tắt camera',
      turnOnCamera: 'Bật camera',
      shareScreen: 'Chia sẻ màn hình',
      stopSharing: 'Dừng chia sẻ',
      reactions: 'Phản ứng',
      moreOptions: 'Thêm tùy chọn',
      leaveMeeting: 'Rời cuộc họp',
      meetingInfo: 'Thông tin cuộc họp',
      chat: 'Trò chuyện',
      participants: 'Người tham gia',
      startRecording: 'Bắt đầu ghi',
      stopRecording: 'Dừng ghi'
    },

    // Create Meeting Modal
    createMeeting: {
      instantTitle: 'Bắt đầu cuộc họp nhanh',
      scheduleTitle: 'Lên lịch cuộc họp',
      roomName: 'Tên phòng',
      roomNamePlaceholder: 'VD: Kế hoạch Q3, Họp thiết kế...',
      description: 'Mô tả',
      descriptionPlaceholder: 'Cuộc họp này về vấn đề gì?',
      accessType: 'Loại truy cập',
      public: 'Công khai',
      private: 'Riêng tư',
      maxParticipants: 'Số người tối đa',
      schedule: 'Lịch trình',
      startDate: 'Ngày bắt đầu',
      startTime: 'Giờ bắt đầu',
      endDate: 'Ngày kết thúc',
      endTime: 'Giờ kết thúc',
      startMeetingNow: 'Bắt đầu ngay',
      scheduleMeetingBtn: 'Lên lịch cuộc họp'
    },

    // Error Messages
    errors: {
      authenticationError: 'Lỗi xác thực',
      configurationError: 'Lỗi cấu hình',
      permissionDenied: 'Từ chối quyền truy cập',
      roomAlreadyExists: 'Phòng đã tồn tại',
      tooManyRequests: 'Quá nhiều yêu cầu',
      serverError: 'Lỗi máy chủ',
      connectionError: 'Lỗi kết nối',
      unexpectedError: 'Lỗi không mong muốn',
      sessionExpired: 'Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.',
      apiNotConfigured: 'API chưa được cấu hình. Vui lòng liên hệ hỗ trợ.',
      invalidMeetingInfo: 'Thông tin cuộc họp không hợp lệ. Vui lòng kiểm tra đầu vào của bạn.',
      noPermission: 'Bạn không có quyền tạo phòng.',
      roomExists: 'Phòng với cấu hình này đã tồn tại.',
      tooQuickly: 'Bạn đang tạo phòng quá nhanh. Vui lòng đợi và thử lại.',
      serverIssues: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
      connectionFailed: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.',
      unknownError: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
    }
  }
};
