import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { 
  Wind, 
  Power,
  Thermometer,
  Calendar,
  Clock,
  Settings,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface VentilationHistory {
  id: string;
  timestamp: string;
  duration: number;
  intensity: number;
  mode: 'manual' | 'auto';
  trigger?: string;
}

export function Ventilation() {
  const [isRunning, setIsRunning] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [autoMode, setAutoMode] = useState(true);
  const [autoTriggerTemp, setAutoTriggerTemp] = useState(25);

  const [history] = useState<VentilationHistory[]>([
    { 
      id: '1', 
      timestamp: '2026-03-15T14:30:00', 
      duration: 10, 
      intensity: 70, 
      mode: 'auto',
      trigger: '온도 26°C 도달'
    },
    { 
      id: '2', 
      timestamp: '2026-03-15T11:30:00', 
      duration: 15, 
      intensity: 80, 
      mode: 'manual'
    },
    { 
      id: '3', 
      timestamp: '2026-03-15T08:45:00', 
      duration: 12, 
      intensity: 60, 
      mode: 'auto',
      trigger: '온도 25°C 도달'
    },
    { 
      id: '4', 
      timestamp: '2026-03-14T16:20:00', 
      duration: 20, 
      intensity: 90, 
      mode: 'auto',
      trigger: '온도 27°C 도달'
    },
    { 
      id: '5', 
      timestamp: '2026-03-14T13:10:00', 
      duration: 8, 
      intensity: 50, 
      mode: 'manual'
    },
  ]);

  const handleToggleVentilation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success(`환풍기 작동 시작 (강도: ${intensity}%)`);
      if (autoMode) {
        setAutoMode(false);
        toast.info("수동 제어 시작으로 자동 모드가 비활성화되었습니다");
      }
    } else {
      toast.info("환풍기 중지");
    }
  };

  const handleAutoVentilation = () => {
    setAutoMode(!autoMode);
    if(!autoMode) {
      toast.success("자동 환풍기 가동");
      if(isRunning) {
        setIsRunning(false);
        toast.info("자동 제어 시작으로 수동 모드가 비활성되었습니다");
      }
    } else {
      toast.info("자동 환풍기 중지");
    }
  }

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0]);
    if (isRunning) {
      toast.info(`강도 변경: ${value[0]}%`);
    }
  };

  const handleAutoModeToggle = (enabled: boolean) => {
    setAutoMode(enabled);
    if (enabled && isRunning) {
      setIsRunning(false);
      toast.info("자동 모드 활성화로 수동 제어가 중지되었습니다");
    }
    toast.success(enabled ? "자동 모드 활성화" : "자동 모드 비활성화");
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">환풍기 제어</h2>
        <p className="text-gray-500 mt-2">펫하우스 내부 공기 순환을 관리하세요</p>
      </div>

      {/* Manual Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <Card className={`border-2 transition-all ${
          isRunning 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-200 bg-white'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className={`w-5 h-5 ${isRunning ? 'text-green-600 animate-spin' : 'text-gray-600'}`} />
              수동 제어
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Power Button */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isRunning ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Power className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">환풍기 전원</div>
                  <div className="text-sm text-gray-500">
                    {isRunning ? '작동 중' : '정지됨'}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleToggleVentilation}
                className={isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
              >
                {isRunning ? '중지' : '시작'}
              </Button>
            </div>

            {/* Intensity Control */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <Label className="text-base font-semibold">강도 조절</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[intensity]}
                  onValueChange={handleIntensityChange}
                  max={100}
                  step={10}
                  className="flex-1"
                  disabled={!isRunning}
                />
                <div className="w-16 text-center">
                  <div className="text-2xl font-bold text-gray-900">{intensity}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleIntensityChange([30])}
                  disabled={!isRunning}
                >
                  약
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleIntensityChange([60])}
                  disabled={!isRunning}
                >
                  중
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleIntensityChange([90])}
                  disabled={!isRunning}
                >
                  강
                </Button>
              </div>
            </div>

            {/* Current Status */}
            {isRunning && (
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Wind className="w-5 h-5 animate-spin" />
                  <span className="font-medium">환풍 작동 중 ({intensity}% 강도)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto Mode Settings */}
        <Card className={`border-2 transition-all ${
          autoMode
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-200 bg-gray-50'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Settings className="w-5 h-5" />
              자동 제어 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto Mode Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              autoMode ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200'
            }`}>
              <div>
                <div className="font-semibold">자동 모드</div>
                <div className="text-sm mt-1">
                  온도에 따 자동으로 작동
                </div>
              </div>
              <Button
                onClick={handleAutoVentilation}
                className={autoMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
              >
                {autoMode ? '중지' : '시작'}
              </Button>
            </div>

            {/* Temperature Trigger */}
            <div className={`space-y-3 p-4 rounded-lg border transition-all ${
              autoMode ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <Label className={`flex items-center gap-2 ${autoMode ? '' : 'text-gray-400'}`}>
                <Thermometer className={`w-4 h-4 ${autoMode ? 'text-blue-600' : 'text-gray-400'}`} />
                작동 온도 설정
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={autoTriggerTemp}
                  onChange={(e) => setAutoTriggerTemp(Number(e.target.value))}
                  disabled={!autoMode}
                  className="flex-1"
                />
                <span className={autoMode ? 'text-gray-600' : 'text-gray-400'}>°C</span>
              </div>
              <div className={`text-sm p-3 rounded border ${
                autoMode
                  ? 'text-gray-600 bg-blue-50 border-blue-200'
                  : 'text-gray-400 bg-gray-200 border-gray-300'
              }`}>
                💡 온도가 {autoTriggerTemp}°C 이상이 되면 환풍기가 자동으로 작동합니다
              </div>
            </div>

            {/* Auto Mode Rules */}
            <div className={`space-y-2 p-4 rounded-lg border transition-all ${
              autoMode ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className={`font-medium mb-2 ${autoMode ? 'text-gray-900' : 'text-gray-400'}`}>자동 제어 규칙</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${autoMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  <span className={autoMode ? 'text-gray-600' : 'text-gray-400'}>{autoTriggerTemp}°C 이상: 강도 70%로 작동</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${autoMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  <span className={autoMode ? 'text-gray-600' : 'text-gray-400'}>{autoTriggerTemp + 2}°C 이상: 강도 90%로 작동</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${autoMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  <span className={autoMode ? 'text-gray-600' : 'text-gray-400'}>{autoTriggerTemp - 2}°C 이하: 자동 중지</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wind className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">오늘 작동 횟수</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2.5시간</div>
                <div className="text-sm text-gray-500">오늘 총 작동 시간</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">68%</div>
                <div className="text-sm text-gray-500">평균 작동 강도</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-500">자동 모드 비율</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>환풍 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((item) => {
              const { date, time } = formatDateTime(item.timestamp);
              return (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.mode === 'auto' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <Wind className={`w-5 h-5 ${
                      item.mode === 'auto' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">
                        {item.duration}분 작동
                      </span>
                      <Badge variant={item.mode === 'auto' ? 'default' : 'secondary'}>
                        {item.mode === 'auto' ? '자동' : '수동'}
                      </Badge>
                      <Badge variant="outline">
                        강도 {item.intensity}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {date} {time}
                    </div>
                    {item.trigger && (
                      <div className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {item.trigger}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}