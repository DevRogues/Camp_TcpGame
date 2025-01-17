# Camp_TcpGame
CH 5 멀티 플레이 과제

## 디렉토리 구조

- 필수기능
1. 프로젝트 생성
2. 인스턴스 생성
3. 유저 접속

- 도전기능
1. DB연동 
2. Latency를 이용한 추측항법 적용

<table>
<tr>
<td>과제 유형</td>
<td>내용</td>
<td>완성 결과</td>
<td>기타</td>
</tr>

<tr>
<td>필수</td>
<td>프로젝트 생성</td>
<td> O </td>
<td></td>
</tr>

<tr>
<td>필수</td>
<td>인스턴스 생성</td>
<td>O</td>
<td></td>
</tr>

<tr>
<td>필수</td>
<td>유저 접속</td>
<td>O</td>
<td></td>
</tr>

<tr>
<td>도전</td>
<td>DB연동</td>
<td>O</td>
<td></td>
</tr>

<tr>
<td>도전</td>
<td>Latency를 이용한 추측항법 적용</td>
<td>x</td>
<td>계산하여 이동 값을 클라이언트에 전송하는 방법은 알겠으나 클라이언트에서 어떤 시점에서 어떻게 데이터를 받아서 처리하고 해야할지에 대해서 해결을 못해서 구현하지 못했습니다.</td>
</tr>

</table>

## 디렉토리 구조
.  
├── assets  
│   ├── item.json  
│   ├── item_unlock.json  
│   └── stage.json  
└── src  
         ├── classes               // 인스턴스 class 들을 정의  
         │           ├── managers  
         │           └── models  
         ├── config                          // 환경변수, DB 설정등을 선언  
         ├── constants                       // 상수 관리  
         ├── db                              // db 로직 관리  
         ├── handler               // 핸들러 관리  
         │           ├── game  
         │           └── user  
         ├── init  
         ├── protobuf              //프로토버프 관리  
         │           ├── notification  
         │           ├── request  
         │           └── response  
         ├── session   
         └── utils    
                     ├── db  
                     ├── error  
                     ├── game  
                     ├── notification  
                     ├── parser  
                     └── response  


## 패킷 구조

- Response

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>handlerId</td>
<td>int</td>
<td>요청을 처리할 서버 핸들러의 ID</td>
</tr>

<tr>
<td>responseCode</td>
<td>int</td>
<td>요청을 보내는 유저의 ID</td>
</tr>

<tr>
<td>timestamp</td>
<td>int</td>
<td>현재 클라이언트 버전 ("1.0.0") (고정)</td>
</tr>

<tr>
<td>data</td>
<td>bytes</td>
<td>payload</td>
</tr>
</table>

<br>

- Common 

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>handlerId</td>
<td>int</td>
<td>요청을 처리할 서버 핸들러의 ID</td>
</tr>

<tr>
<td>userId</td>
<td>string</td>
<td>유저의 ID</td>
</tr>

<tr>
<td>version</td>
<td>string</td>
<td>현재 클라이언트 버전 ("1.0.0") (고정)</td>
</tr>

<tr>
<td>payload</td>
<td>bytes</td>
<td>요청 데이터</td>
</tr>
</table>

<br>

- Initial

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>deviceId</td>
<td>string</td>
<td>유저의 디바이스 ID</td>
</tr>

<tr>
<td>playerId</td>
<td>int</td>
<td>플레이어 ID</td>
</tr>

<tr>
<td>latency</td>
<td>float</td>
<td>클라이언트 지연 시간 (고정)</td>
</tr>

<tr>
<td>speed</td>
<td>float</td>
<td>캐릭터 이동속도</td>
</tr>
</table>

<br>

- LocationUpdatePayload

<table>
<tr>
<td>필드 명</td>
<td>타입</td>
<td>설명</td>
</tr>

<tr>
<td>x</td>
<td>float</td>
<td>유저 캐릭터 좌표 X값</td>
</tr>

<tr>
<td>y</td>
<td>float</td>
<td>유저 캐릭터 좌표 Y값</td>
</tr>

<tr>
<td>speed</td>
<td>float</td>
<td>캐릭터 이동속도</td>
</tr>

</table>

<br>

